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
 *   id = "learner_progress_detailed",
 *   label = @Translation("Detailed learner progress"),
 *   uri_paths = {
 *     "canonical" = "/learner/progress/{course}",
 *     "https://www.drupal.org/link-relations/create" = "/learner/progress/{lesson}/{progress}",
 *   }
 * )
 */
class LearnerProgressDetailedResource extends ResourceBase {

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
   * TODO.
   */
  public function post($lessonId, $progress) {

    $a=1;
    // TODO: Validate permissions to view the lesson.

    try {

      // Validate submitted lesson.
      $entities = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
        'type' => 'lesson',
        'nid' => $lessonId,
      ]);
      if (empty($entities)) {
        $message = 'Wrong lesson id: @lesson_id';
        $params = ['@lesson_id' => $lessonId];
        $this->logger->error($message, $params);
        return new ResourceResponse([
          'message' => $this->t($message, $params)
        ], 406);
      }

      $lesson = reset($entities);

      // Validate progress amount.
      if ($progress < 0 || $progress > 100) {
        $message = 'Wrong or missing progress amount for lesson: @lesson_id';
        $params = ['@lesson_id' => $lesson->id()];
        $this->logger->error($message, $params);
        return new ResourceResponse([
          'message' => $this->t($message, $params)
        ], 406);
      }

      $this->updateLessonProgress('lesson', $lesson->id(), $progress);

      // Load related course.
      $course = $lesson->get('field_lesson_course')->entity;
      if (!empty($course)) {

        // Search for existing lesson progress entity.
        $entities = \Drupal::entityTypeManager()
          ->getStorage('learner_progress')
          ->loadByProperties([
            'uid' => \Drupal::currentUser()->id(),
            'type' => 'course',
            'field_course' => $course->id(),
          ]);

        // Get the existing lesson progress entity or create a new one.
        if (!empty($entities)) {
          $course_progress = reset($entities);
        }
        else {
          $course_progress = \Drupal::entityTypeManager()
            ->getStorage('learner_progress')
            ->create([
              'type' => 'course',
              'field_course' => $course->id(),
            ]);
        }

        // Set the new progress value.
        $course_progress->field_lesson = $lesson->id();

        // Updates entity changed date because we need to update entity, but nothing else has changed.
        $course_progress->changed = \Drupal::time()->getRequestTime();

        // Update existing or create a new entity.
        $course_progress->save();
      }
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not update learner progress. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
      return new ResourceResponse(['message' => $message], 406);
    }

    $response = new ResourceResponse();
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

  public function get($courseId) {
    $progress = [
      'course' => 0,
      'lessons' => [],
      'recentLesson' => [],
    ];

    // TODO: Perms to view?

    try {
      $course = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->load($courseId);

      if (empty($course)) {
        // TODO: Throw error.
        return;
      }

      $course_lessons = $course->get('field_course_lessons')->getValue();
      $course_lessons_ids = [];
      foreach ($course_lessons as $course_lesson) {
        $course_lessons_ids[] = $course_lesson['target_id'];
      }

      $lesson_progresses = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'uid' => \Drupal::currentUser()->id(),
          'type' => 'lesson',
          'field_lesson' => $course_lessons_ids,
        ]);

      $lessons_amount = count($course_lessons_ids);
      $max_progress = 100 / $lessons_amount;

      foreach ($lesson_progresses as $lesson_progress) {
        $field_progress = $lesson_progress->get('field_progress')->getValue();
        $field_lesson = $lesson_progress->get('field_lesson')->getValue();
        $progress['course'] += $max_progress / 100 * $field_progress[0]['value'];
        $progress['lessons'][$field_lesson[0]['target_id']] = $field_progress[0]['value'];
      }


      $course_progress = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'type' => 'course',
          'field_course' => $course->id(),
          'uid' => \Drupal::currentUser()->id(),
        ]);

      if (!empty($course_progress)) {
        $course_progress = reset($course_progress);
        $field_lesson = $course_progress->get('field_lesson')->getValue();
        if (!empty($field_lesson[0]['target_id'])) {

          $recent_lesson = \Drupal::entityTypeManager()
            ->getStorage('node')
            ->load($field_lesson[0]['target_id']);

          $path = \Drupal::service('path.alias_manager')
            ->getAliasByPath('/node/' . $recent_lesson->id());

          $progress['recentLesson'] = [
            'lessonId' => $recent_lesson->id(),
            'url' => $path,
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

    $response = new ResourceResponse($progress);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

  /**
   * TODO.
   *
   * @param $type
   * @param $id
   * @param $progress
   */
  protected function updateLessonProgress($type, $id, $progress) {
    try {

      // Search for existing lesson progress entity.
      $entities = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'uid' => \Drupal::currentUser()->id(),
          'type' => $type,
          'field_' . $type => $id,
        ]);

      // Get the existing lesson progress entity or create a new one.
      if (!empty($entities)) {
        $entity = reset($entities);
      }
      else {
        $entity = \Drupal::entityTypeManager()
          ->getStorage('learner_progress')
          ->create([
            'type' => $type,
            'field_' . $type => $id,
          ]);
      }

      $prevProgress = $entity->field_progress->getValue();
      if (!empty($prevProgress[0]['value'])) {
        if ($prevProgress[0]['value'] < $progress) {
          $entity->field_progress = $progress;
        }
      }
      else {
        $entity->field_progress = $progress;
      }


      // Updates entity changed date because we need to update entity, but nothing else has changed.
      $entity->changed = \Drupal::time()->getRequestTime();

      // Update existing or create a new entity.
      $entity->save();

    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not update lesson progress entity of type @type (id @id). Error: @error', [
        '@type' => $type,
        '@id' => $id,
        '@error' => $e->getMessage(),
      ]);
      $this->logger->critical($message);
      throw new UnprocessableEntityHttpException($message);
    }
  }

}
