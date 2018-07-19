<?php

namespace Drupal\anu_courses\Plugin\rest\resource;

use Drupal\anu_courses\Course;
use Drupal\Core\Path\AliasManagerInterface;
use Drupal\node\Entity\Node;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a course with learner's progress.
 *
 * @RestResource(
 *   id = "course_with_progress",
 *   label = @Translation("Course info with learner progress"),
 *   uri_paths = {
 *     "canonical" = "/course/progress"
 *   }
 * )
 */
class CourseWithProgress extends ResourceBase {

  /**
   * A current request object.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $currentRequest;

  /**
   * Path alias manager service object.
   *
   * @var \Drupal\Core\Path\AliasManagerInterface
   */
  protected $aliasManager;

  /**
   * Helper object with course related methods.
   *
   * @var \Drupal\anu_courses\Course
   */
  protected $coursesManager;

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
   * @param \Symfony\Component\HttpFoundation\Request $current_request
   *   The current request.
   * @param \Drupal\Core\Path\AliasManagerInterface $alias_manager
   *   Path alias manager object.
   * @param \Drupal\anu_courses\Course $course_manager
   *   Object with helper functions for course.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, Request $current_request, AliasManagerInterface $alias_manager, Course $course_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentRequest = $current_request;
    $this->aliasManager = $alias_manager;
    $this->coursesManager = $course_manager;
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
      $container->get('logger.factory')->get('anu_courses'),
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('path.alias_manager'),
      $container->get('anu_courses.course')
    );
  }

  /**
   * Returns a course node filtered by path with breakdown for learner's progress.
   */
  public function get() {

    $course_path = $this->currentRequest->query->get('path');
    if (empty($course_path)) {
      throw new BadRequestHttpException('Missing required parameter "path".');
    }

    // Get internal path from requested path alias.
    $path = $this->aliasManager->getPathByAlias($course_path);
    if (preg_match('/node\/(\d+)/', $path, $matches)) {
      /** @var \Drupal\node\NodeInterface $course */
      $course = Node::load($matches[1]);
    }

    // Make sure the current node object is actually a course.
    if (empty($course) || (!empty($course) && $course->bundle() !== 'course')) {
      $message = sprintf('The requested course with path %s was not found.', $course_path);
      $this->logger->error($message);
      throw new HttpException(404, $message);
    }

    // Make sure the current user can access the course.
    if (!$course->access('view')) {
      $message = sprintf('The current user doesn\'t have access to the requested course %d.', $course->id());
      $this->logger->error($message);
      throw new HttpException(403, $message);
    }

    // Load all necessary course data with progress for the currently logged
    // in user.
    $data = $this->coursesManager->loadWithProgress($course->id());

    return new ResourceResponse($data);
  }

}
