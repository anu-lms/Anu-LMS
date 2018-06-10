<?php

namespace Drupal\anu_search\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\anu_normalizer\AnuNormalizerBase;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\search_api\ParseMode\ParseModePluginManager;
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
   * Defines search category constants.
   */
  const CATEGORY_ALL = 'all';
  const CATEGORY_MEDIA = 'media';
  const CATEGORY_RESOURCES = 'resources';

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
   * @param \Symfony\Component\HttpFoundation\Request $current_request
   *   Request represents an HTTP request.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   An interface for entity type managers.
   * @param \Drupal\search_api\ParseMode\ParseModePluginManager $parse_mode_manager
   *   Manages parse mode plugins.
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
   *   Response with an array of search items.
   */
  public function get() {
    $fulltext = NULL;
    $category = self::CATEGORY_ALL;

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

    if ($category == self::CATEGORY_MEDIA) {
      // Fields related to the Lesson content.
      $full_text_fields = [
        'title', 'field_paragraph_text', 'field_paragraph_title', 'field_paragraph_list', 'field_quiz_options',
        'field_paragraph_text_1', 'field_paragraph_title_1',
      ];
      $query
        ->addCondition('status', 1)
        ->addCondition('search_api_datasource', 'entity:node')
        ->addCondition('content_type', 'lesson')
        ->addCondition('content_paragraph_type', ['image_centered_caption', 'media_video'], 'IN');
    }
    elseif ($category == self::CATEGORY_RESOURCES) {
      // Fields related to the Resources content.
      $full_text_fields = [
        'field_paragraph_private_file', 'field_resource_title',
      ];
      $query
        ->addCondition('search_api_datasource', 'entity:paragraph')
        ->addCondition('paragraph_type', 'media_resource');
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
      elseif ($entity_type == 'node' && $entity_bundle == 'lesson' && $category == self::CATEGORY_MEDIA) {
        $include_fields = ['media'];
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
  }

}
