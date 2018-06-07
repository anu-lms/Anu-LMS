<?php

namespace Drupal\anu_search\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\search_api\ParseMode\ParseModePluginManager;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\anu_normalizer\AnuNormalizerBase;

/**
 * Provides a resource to load notifications of the current user.
 *
 * @RestResource(
 *   id = "search_results",
 *   label = @Translation("Search results"),
 *   uri_paths = {
 *     "canonical" = "/site/search"
 *   }
 * )
 */
class SearchResults extends ResourceBase {

  /**
   * Constructs a new SearchResults object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   Logger service.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    Request $current_request,
    EntityTypeManagerInterface $entity_type_manager,
    ParseModePluginManager $parse_mode_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->currentRequest = $current_request;
    $this->entityTypeManager = $entity_type_manager;
    $this->index = $entity_type_manager->getStorage('search_api_index')->load('content');

    $this->parseModeManager = $parse_mode_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('anu_search'),
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('entity_type.manager'),
      $container->get('plugin.manager.search_api.parse_mode')
    );
  }

  /**
   * Return search results by given query params.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $fulltext = NULL;
    $category = 'all'; //@todo: move to consts

    // Get given query params.
    $filters = $this->currentRequest->query->get('filter');
    if ($filters != NULL) {
      if (isset($filters['fulltext']['condition']['fulltext'])) {
        $fulltext = $filters['fulltext']['condition']['fulltext'];
      }

      if (isset($filters['category']['condition']['category'])) {
        $category = $filters['category']['condition']['category'];
      }
    }

    // Don't process short search queries.
    if (empty($fulltext) || strlen($fulltext) < 2) {
      return new ResourceResponse([], 200);
    }

    // @todo: might be enhanced on infinite scroll step.
    $page = 0;

    // Defines search params. @see: \Drupal\search_api\Plugin\search_api\parse_mode\Terms.
    /* @var $query \Drupal\search_api\Query\QueryInterface */
    $query = $this->index->query();
    $parse_mode = $this->parseModeManager->createInstance('terms');
    $parse_mode->setConjunction('AND');
    $query->setParseMode($parse_mode);

    // Defines keywords to filter by.
    if (!empty($fulltext)) {
      $query->keys([$fulltext]);
    }

    if ($category == 'media') {
      // Fields related to the Lesson content.
      $full_text_fields = [
        'title', 'field_paragraph_text', 'field_paragraph_title', 'field_paragraph_list', 'field_quiz_options',
        'field_paragraph_text_1', 'field_paragraph_title_1',
      ];
    }
    elseif ($category == 'resources') {
      // Fields related to the Resources content.
      $full_text_fields = [
        'field_paragraph_private_file', 'field_resource_title',
      ];
    }
    else {
      // Fields related to the all content.
      $full_text_fields = [
        'field_comment_text', 'title', 'field_paragraph_text',
        'field_paragraph_title', 'field_paragraph_list', 'field_quiz_options',
        'field_paragraph_text_1', 'field_paragraph_title_1', 'field_notebook_body',
        'field_notebook_title', 'field_paragraph_private_file', 'field_resource_title',
      ];
    }

    // Defines fulltext search fields.
    $query->setFulltextFields($full_text_fields);


    // @todo: An example of conditions, remove if unnecessary.
    //    $conditions = $query->createConditionGroup();
    //    if (!empty($conditions->getConditions())) {
    //
    //      $conditions
    //        ->addCondition('search_api_datasource', 'entity:node', '<>')
    //        ->addCondition('created', 7 * 24 * 3600, '>=');
    //
    //      $query->addConditionGroup($conditions);
    //    }
    // @todo: An example of conditions, remove if unnecessary.
    //    $location_options = (array) $query->getOption('search_api_location', []);
    //    $location_options[] = [
    //      'field' => 'latlon',
    //      'lat' => $latitude,
    //      'lon' => $longitude,
    //      'radius' => '8.04672',
    //    ];
    //    $query->setOption('search_api_location', $location_options);
    // Defines default sort.
    $query->sort('search_api_relevance', 'DESC');

    // Defines pager. @todo: might be enhanced on infinite scroll step.
    $query->range(($page * 20), 20);

    /** @var \Drupal\search_api\Query\ResultSetInterface $result_set */
    $result_set = $query->execute();

    $entities = [];
    /** @var \Drupal\search_api\Item\ItemInterface $item */
    foreach ($result_set->getResultItems() as $item) {
      $entity = $item->getOriginalObject()->getValue();
      $entity_type = $entity->getEntityTypeId();
      $entity_bundle = $entity->bundle();

      $include_fields = [];
      // Prepares additional fields for normalizer function.
      if ($entity_type == 'paragraph_comment') {
        $include_fields = ['lesson'];
      }
      elseif ($entity_type == 'paragraph' && $entity_bundle == 'media_resource') {
        $include_fields = ['lesson'];
      }

      // Normalizes entity and add to the results array.
      if ($entity_normalized = AnuNormalizerBase::normalizeEntity($entity, $include_fields)) {
        $entities[] = [
          'type' => $entity_bundle,
          'entity' => $entity_normalized,
          'excerpt' => $item->getExcerpt(),
        ];
      }
    }

    return new ResourceResponse(array_values($entities), 200);

    // @todo: An example, remove if unnecessary.
    //    $cacheable_metadata = new CacheableMetadata();
    //    $cacheable_metadata->setCacheContexts([
    //      'url.query_args',
    //      'url.query_args:filter',
    //    ]);
    //    $response->addCacheableDependency($cacheable_metadata);
    //    return $response;
  }

}
