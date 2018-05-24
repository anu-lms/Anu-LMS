<?php

namespace Drupal\anu_search\Plugin\rest\resource;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\search_api\ParseMode\ParseModePluginManager;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\jsonapi\Resource\EntityCollection;
use Drupal\jsonapi\Resource\JsonApiDocumentTopLevel;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;

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
   *   A current user instance.
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
   * Return list of notifications for the current user.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $fulltext = NULL;

    $filters = $this->currentRequest->query->get('filter');
    if ($filters != NULL) {
      if (isset($filters['fulltext'])) {
        $fulltext = $filters['fulltext']['condition']['fulltext'];
      }
    }
    $page = 0;

    /* @var $query \Drupal\search_api\Query\QueryInterface */
    $query = $this->index->query();
    $parse_mode = $this->parseModeManager->createInstance('terms');
    $parse_mode->setConjunction('AND');
    $query->setParseMode($parse_mode);

    if (!empty($fulltext)) {
      $query->keys([$fulltext]);
    }

    $query->setFulltextFields([
      'field_comment_text', 'title', 'field_paragraph_text',
      'field_paragraph_title', 'field_paragraph_list', 'field_quiz_options',
      'field_paragraph_text_1', 'field_paragraph_title_1', 'field_notebook_body',
      'field_notebook_title'
    ]);

    $conditions = $query->createConditionGroup();
    if (!empty($conditions->getConditions())) {

//      $conditions
//        ->addCondition('search_api_datasource', 'entity:node', '<>')
//        ->addCondition('created', 7 * 24 * 3600, '>=');

      $query->addConditionGroup($conditions);
    }

    $query->sort('search_api_relevance', 'DESC');


//    $location_options = (array) $query->getOption('search_api_location', []);
//    $location_options[] = [
//      'field' => 'latlon',
//      'lat' => $latitude,
//      'lon' => $longitude,
//      'radius' => '8.04672',
//    ];
//    $query->setOption('search_api_location', $location_options);


    $query->range(($page * 20), 20);

    /** @var \Drupal\search_api\Query\ResultSetInterface $result_set */
    $result_set = $query->execute();

    $entities = [];
    /** @var \Drupal\search_api\Item\ItemInterface $item */
    foreach ($result_set->getResultItems() as $item) {
      $entity = $item->getOriginalObject()->getValue();
      //$normalizad_entity = \Drupal::service('serializer')->normalize($entity, 'json');
      //$entities[] = $entity;
      $entities[] = $item->getExcerpt();
    }

    return new ResourceResponse(array_values($entities), 200);

//    $entity_collection = new EntityCollection($entities);
//    $response = new ResourceResponse(new JsonApiDocumentTopLevel($entity_collection), 200, []);
//    $cacheable_metadata = new CacheableMetadata();
//    $cacheable_metadata->setCacheContexts([
//      'url.query_args',
//      'url.query_args:filter',
//    ]);
//    $response->addCacheableDependency($cacheable_metadata);
//    return $response;
  }

}
