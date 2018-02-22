<?php

namespace Drupal\anu_learner_progress\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a resource to get and update Course progress.
 *
 * @RestResource(
 *   id = "learner_progress",
 *   label = @Translation("Learner progress"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/learner/progress",
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
   * Responds to POST requests.
   *
   * Creates or updates learner progress entity.
   *
   * Currently just updates entity for course to get data about recent courses.
   * @todo: will be improved to calculate real progress for Lessons and Course
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {

    try {
      $type = 'course';

      // Search for existing quiz result entity.
      $entities = \Drupal::entityTypeManager()->getStorage('learner_progress')->loadByProperties([
        'uid' => \Drupal::currentUser()->id(),
        'type' => $type,
        'field_course' => $data['courseId'],
      ]);
      // Create a revision for existing entity or create a new one.
      if (!empty($entities)) {
        $entity = reset($entities);
      }
      else {
        $entity = \Drupal::entityTypeManager()->getStorage('learner_progress')->create([
            'type' => $type,
            'field_course' => $data['courseId'],
          ]
        );
      }

      // Updates entity without any changes just to update 'changed' date.
      $entity->save();
    } catch(\Exception $e) {
      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = new FormattableMarkup('Could not update learner progress.', []);
      }
      $this->logger->critical($message);
      return new ResourceResponse([
        'message' => $message
      ], 406);
    }

    $response = new ResourceResponse($entity, 200);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

}
