<?php

namespace Drupal\anu_comments\Plugin\rest\resource;

use Drupal\user\Entity\User;
use Drupal\taxonomy\Entity\Term;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Core\Session\AccountProxyInterface;
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
    Request $current_request,
    AccountProxyInterface $current_user) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentRequest = $current_request;
    $this->currentUser = $current_user;
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
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('current_user')
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
    // Filter by isRead get param if exists.
    $search_query = trim($this->currentRequest->query->get('query'));

    // Filter by isRead get param if exists.
    $organization_id = $this->currentRequest->query->get('organization_id');
    $organization = Term::load($organization_id);

    if (!$organization || !$organization->access('view')) {
      return new ResourceResponse([], 406);
    }

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

    $output = [];
    foreach ($accounts as $account) {
      if ($account->access('view')) {
        $output[] = AnuNormalizerBase::normalizeEntity($account);
      }
    }

    // Returns an array of normalized user entities.
    return new ResourceResponse($output, 200);
  }

}
