<?php

namespace Drupal\anu_course_resources\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to get and update Learner progress.
 *
 * @RestResource(
 *   id = "course_resources",
 *   label = @Translation("Course resources"),
 *   uri_paths = {
 *     "canonical" = "/course/resources/{course}"
 *   }
 * )
 */
class CourseResourcesResource extends ResourceBase {

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
      $container->get('logger.factory')->get('anu_course_resources')
    );
  }

  /**
   * Return list of course resources accessible for the
   * logged in user.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get($courseId) {
    $resources = [];

    try {

      // Trying to load the requested course.
      $course = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->load($courseId);

      // Validate the loaded course.
      if (empty($course) || $course->bundle() != 'course') {
        $message = 'The requested course with ID @id could not be found.';
        $params = ['@id' => $courseId];
        $this->logger->critical($message, $params);
        return new ResourceResponse(['message' => $this->t($message, $params)], 406);
      }

      // Make sure the current user is able to view the course entity.
      if (!$course->access('view')) {
        $message = 'Your are not allowed to access the course @id.';
        $params = ['@id' => $courseId];
        $this->logger->critical($message, $params);
        return new ResourceResponse(['message' => $this->t($message, $params)], 406);
      }

      // Build an array of lesson IDs from the requested course.
      $course_lessons = $course->get('field_course_lessons')->getValue();
      $course_lessons_ids = [];
      foreach ($course_lessons as $course_lesson) {
        $course_lessons_ids[] = $course_lesson['target_id'];
      }

      // Load paragraphs of the resource type for course lessons.
      $paragraphs = \Drupal::entityTypeManager()
        ->getStorage('paragraph')
        ->loadByProperties([
          'type' => 'media_resource',
          'parent_id' => $course_lessons_ids,
        ]);

      // Build an array of lesson entities who hold the resource paragraphs.
      $lessons_with_paragraphs = [];
      foreach ($paragraphs as $paragraph) {
        $lesson = $paragraph->getParentEntity();
        if (empty($lessons_with_paragraphs[$lesson->id()])) {
          $lessons_with_paragraphs[$lesson->id()] = $lesson;
        }
      }

      // Looping though all lessons available in the course. It's important
      // to use this array to keep the right order of resouces display matching
      // the order of lessons in course.
      foreach ($course_lessons_ids as $lesson_id) {

        // If the current lesson from the course does not contain paragraphs
        // with resources - nothing to do here.
        if (empty($lessons_with_paragraphs[$lesson_id])) {
          continue;
        }

        // Make sure the current user has access to view the lesson with
        // resources.
        $lesson = $lessons_with_paragraphs[$lesson_id];
        if (!$lesson->access('view')) {
          continue;
        }

        // Looping through the paragraphs of the lesson. It's important to do
        // it to keep the order of resources within the lesson matching the
        // order of paragraphs in the lesson.
        foreach ($lesson->field_lesson_blocks as $field_item) {
          $target_paragraph = $field_item->getValue();
          $paragraph_id = $target_paragraph['target_id'];

          if (!empty($paragraphs[$paragraph_id])) {
            $paragraph = $paragraphs[$paragraph_id];

            // Load the file from paragraph.
            $file = $paragraph->field_paragraph_private_file
              ->first()
              ->get('entity')
              ->getTarget()
              ->getValue();

            // Add necessary info to the output.
            $resources[] = [
              'id' => $file->id(),
              'filename' => $file->filename->getString(),
              'title' => $paragraph->field_paragraph_title->getString(),
            ];
          }
        }
      }

    }
    catch (\Exception $e) {
      $message = new FormattableMarkup('Could not load course resources for course @id. Error: @error', [
        '@id' => $courseId,
        '@error' => $e->getMessage(),
      ]);
      $this->logger->critical($message);
      return new ResourceResponse(['message' => $message], 406);
    }

    return !empty($resources) ? new ResourceResponse($resources) : new ResourceResponse();
  }

}
