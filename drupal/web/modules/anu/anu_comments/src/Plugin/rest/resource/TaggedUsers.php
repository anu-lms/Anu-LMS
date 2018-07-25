<?php

namespace Drupal\anu_comments\Plugin\rest\resource;

use Drupal\user\Entity\User;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\anu_normalizer\AnuNormalizerBase;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "tagged_users",
 *   label = @Translation("Tagged users"),
 *   uri_paths = {
 *     "canonical" = "/user/tagged"
 *   }
 * )
 */
class TaggedUsers extends ResourceBase {

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
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
   *   A logger instance.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    Request $current_request) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentRequest = $current_request;
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
      $container->get('logger.factory')->get('anu_comments'),
      $container->get('request_stack')->getCurrentRequest()
    );
  }

  /**
   * Responds to GET requests.
   *
   * Returns a list of users by given text.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get() {
    $account = User::load(4);

    // Filter by isRead get param if exists.
    $search_query = $this->currentRequest->query->get('query');

    // Filter by isRead get param if exists.
    $organization_id = $this->currentRequest->query->get('organization_id');

    // @todo: check that user has an access to this organization.

    $query = \Drupal::entityQuery('user')
      ->condition('status', 1)
      ->condition('field_organization', $organization_id);

    $group = $query->orConditionGroup()
      ->condition('name', $search_query, 'STARTS_WITH')
      ->condition('field_first_name', $search_query, 'STARTS_WITH')
      ->condition('field_last_name', $search_query, 'STARTS_WITH');

    $ids = $query
      ->condition($group)
      ->range(0, 10)
      ->execute();

    $accounts = User::loadMultiple($ids);

    // Returns normalized user entity.
    $response = new ResourceResponse(AnuNormalizerBase::normalizeEntity($account), 200);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

}
