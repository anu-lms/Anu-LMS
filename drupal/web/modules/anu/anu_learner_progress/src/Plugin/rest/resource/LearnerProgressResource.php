<?php

namespace Drupal\anu_learner_progress\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\PreconditionRequiredHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

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

  public function get() {
    $progress = [];

    // TODO: Perms to view?

    try {

      $lesson_progress_entities = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'type' => 'lesson',
          'uid' => \Drupal::currentUser()->id(),
        ]);

      $lesson_progresses = [];
      foreach ($lesson_progress_entities as $lesson_progress_entity) {
        $lesson = $lesson_progress_entity->get('field_lesson')->getValue();
        $lesson_progresses[$lesson[0]['target_id']] = $lesson_progress_entity;
      }

      if (!empty($lesson_progresses)) {

        $entities = \Drupal::entityTypeManager()
          ->getStorage('node')
          ->loadByProperties([
            'type' => 'course',
            'field_course_lessons' => array_keys($lesson_progresses)
          ]);

        $courses = [];
        foreach ($entities as $entity) {
          $courses[$entity->id()] = $entity;
        }

        $course_progresses = \Drupal::entityTypeManager()
          ->getStorage('learner_progress')
          ->loadByProperties([
            'type' => 'course',
            'field_course' => array_keys($courses),
            'uid' => \Drupal::currentUser()->id(),
          ]);

        usort($course_progresses, function($a, $b) {
          return $a->changed->value < $b->changed->value;
        });

        foreach ($course_progresses as $course_progress) {

          $recent_lesson = [];
          $field_lesson = $course_progress->get('field_lesson')->getValue();
          if (!empty($field_lesson[0]['target_id'])) {

            $recent_lesson_entity = \Drupal::entityTypeManager()
              ->getStorage('node')
              ->load($field_lesson[0]['target_id']);

            $path = \Drupal::service('path.alias_manager')
              ->getAliasByPath('/node/' . $recent_lesson_entity->id());

            $recent_lesson = [
              'lessonId' => $recent_lesson_entity->id(),
              'url' => $path,
            ];
          }

          $field_course = $course_progress->field_course->getValue();
          $course = $courses[$field_course[0]['target_id']];

          $course_lessons = $course->get('field_course_lessons')->getValue();
          $course_lessons_ids = [];
          foreach ($course_lessons as $course_lesson) {
            $course_lessons_ids[] = $course_lesson['target_id'];
          }

          $lessons_amount = count($course_lessons_ids);
          $max_progress = 100 / $lessons_amount;

          $course_progress = 0;
          foreach ($course_lessons_ids as $course_lessons_id) {
            if (!empty($lesson_progresses[$course_lessons_id])) {
              $lesson_progress = $lesson_progresses[$course_lessons_id];
              $field_progress = $lesson_progress->get('field_progress')->getValue();
              $course_progress += $max_progress / 100 * $field_progress[0]['value'];
            }
          }




          $progress[] = [
            'courseId' => $course->id(),
            'progress' => $course_progress,
            'recentLesson' => $recent_lesson,
          ];
        }
      }
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not fetch learner progress. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
      return new ResourceResponse(['message' => $message], 406);
    }

    return new ResourceResponse($progress);
  }

}
