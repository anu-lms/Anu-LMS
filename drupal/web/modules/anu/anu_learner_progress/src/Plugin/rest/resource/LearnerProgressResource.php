<?php

namespace Drupal\anu_learner_progress\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to get and update Learner progress.
 *
 * @RestResource(
 *   id = "learner_progress",
 *   label = @Translation("Learner progress"),
 *   uri_paths = {
 *     "canonical" = "/learner/progress"
 *   }
 * )
 */
class LearnerProgressResource extends ResourceBase {

  /**
   * Constructs a new LearnerProgressResource object.
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
    LoggerInterface $logger) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
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
      $container->get('logger.factory')->get('anu_learner_progress')
    );
  }

  /**
   * Return course progress for the currently
   * logged in user.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {

    /* @var $learnerProgress \Drupal\anu_learner_progress\LearnerProgress */
    $learnerProgress = \Drupal::service('anu_learner_progress.learner_progress');
    $progress = $learnerProgress->load();

    return !empty($progress) ? new ResourceResponse($progress) : new ResourceResponse();
  }
}
