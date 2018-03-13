<?php

namespace Drupal\anu_learner_progress\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
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
   * Saves lesson' progress of the current user.
   *
   * @param $lessonId
   *   Node ID of the lesson.
   *
   * @param $progress
   *   Value from 0 to 100 representing the current progress.
   *
   * @return $this|\Drupal\rest\ResourceResponse
   */
  public function post($lessonId, $progress) {

    try {

      // Validate submitted lesson.
      $lesson = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->load($lessonId);

      if (empty($lesson) || $lesson->bundle() != 'lesson') {
        $message = 'Could not post learner\'s progress: wrong posted entity (@id).';
        $params = ['@id' => $lessonId];
        $this->logger->critical($message, $params);
        return new ResourceResponse(['message' => $this->t($message, $params)], 406);
      }

      // Make sure the current user is able to view the lesson entity.
      if (!$lesson->access('view')) {
        $message = 'Your are not allowed to access the lesson @id.';
        $params = ['@id' => $lessonId];
        $this->logger->critical($message, $params);
        return new ResourceResponse(['message' => $this->t($message, $params)], 406);
      }

      // Validate progress amount.
      if ($progress < 0 || $progress > 100) {
        $message = 'Wrong or missing progress amount for lesson: @lesson_id';
        $params = ['@lesson_id' => $lesson->id()];
        $this->logger->critical($message, $params);
        return new ResourceResponse(['message' => $this->t($message, $params)], 406);
      }

      // Save lesson's progress in the new or existing learner progress entity.
      $this->updateLessonProgress($lesson->id(), $progress);

      // Load a course related to the lesson.
      $course = $lesson->get('field_lesson_course')->entity;
      if (!empty($course)) {

        // Get a new or existing lesson progress entity of type course.
        $course_progress = $this->getLessonProgressEntity('course', $course->id());

        // Set the lesson field which was accessed.
        $course_progress->field_lesson = $lesson->id();

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

    return new ResourceResponse();
  }

  /**
   * Responds to GET request.
   *
   * Return detailed progress for the currently logged in user
   * for the requested course ID.
   *
   * @param $courseId
   *   Node ID of the course type.
   *
   * @return $this|\Drupal\rest\ResourceResponse
   */
  public function get($courseId) {
    $progress = [
      'course' => 0,
      'lessons' => [],
      'recentLesson' => [],
    ];

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

      // Load existing records regarding progress for course's lessons.
      $lesson_progresses = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'uid' => \Drupal::currentUser()->id(),
          'type' => 'lesson',
          'field_lesson' => $course_lessons_ids,
        ]);

      // Figure out how much each lesson can add to the overall course
      // progress in case if lesson's progress is 100%.
      $lessons_amount = count($course_lessons_ids);
      $max_progress = 100 / $lessons_amount;

      // Calculate course's and lessons progress.
      foreach ($lesson_progresses as $lesson_progress) {
        $field_progress = $lesson_progress->get('field_progress')->getValue();
        $field_lesson = $lesson_progress->get('field_lesson')->getValue();
        $lesson_id = $field_lesson[0]['target_id'];
        $progress['course'] += $max_progress / 100 * $field_progress[0]['value'];
        $progress['lessons'][$lesson_id] = $field_progress[0]['value'];
      }

      // Add recently accessed lesson id and url to the output.
      $course_progress = $this->getLessonProgressEntity('course', $course->id());
      if (!empty($course_progress->id())) {
        $recent_lesson = $course_progress->get('field_lesson')->entity;
        if (!empty($recent_lesson)) {

          // Fetch lesson's path alias.
          $path = \Drupal::service('path.alias_manager')
            ->getAliasByPath('/node/' . $recent_lesson->id());

          $progress['recentLesson'] = [
            'lessonId' => $recent_lesson->id(),
            'url' => $path,
          ];
        }
      }

    } catch(\Exception $e) {
      $message = 'Could not fetch course progress for ID @id. Error: @error.';
      $params = ['@id' => $courseId, '@error' => $e->getMessage()];
      $this->logger->critical($message, $params);
      return new ResourceResponse(['message' => $this->t($message, $params)], 406);
    }

    return new ResourceResponse($progress);
  }

  /**
   * Save a new lesson progress.
   *
   * @param $id
   *   ID of learner progress entity of type "lesson".
   *
   * @param $progress
   *   Numeric value from 0 to 100 representing the current progress.
   */
  protected function updateLessonProgress($id, $progress) {
    try {

      // Get a new or existing lesson progress entity.
      $lesson_progress = $this->getLessonProgressEntity('lesson', $id);

      // Check if the previous progress exists. If it exists, then make sure
      // the new progress is greater that then previous one - we should never
      // let the progress to go down.
      $prevProgress = $lesson_progress->field_progress->getValue();
      if (!empty($prevProgress[0]['value'])) {
        if ($prevProgress[0]['value'] < $progress) {
          $lesson_progress->field_progress = $progress;
        }
      }
      else {
        $lesson_progress->field_progress = $progress;
      }

      // Update existing or create a new entity.
      $lesson_progress->save();

    } catch(\Exception $e) {
      $message = $this->t('Could not update lesson progress entity of type lesson (id @id). Error: @error', [
        '@id' => $id,
        '@error' => $e->getMessage(),
      ]);
      $this->logger->critical($message);
      throw new UnprocessableEntityHttpException($message);
    }
  }

  /**
   * Return lesson progress entity of a given bundle and ID.
   *
   * @param $bundle
   *   Learner progress entity bundle name.
   *
   * @param $id
   *   Learner progress entity ID.
   *
   * @return \Drupal\Core\Entity\EntityInterface|mixed
   */
  protected function getLessonProgressEntity($bundle, $id) {
    try {

      // Search for existing lesson progress entity.
      $entities = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'uid' => \Drupal::currentUser()->id(),
          'type' => $bundle,
          'field_' . $bundle => $id,
        ]);

      // Get the existing learner progress entity.
      if (!empty($entities)) {
        $entity = reset($entities);
      }
      // Create a new learner progress entity if didn't exist before.
      else {
        $entity = \Drupal::entityTypeManager()
          ->getStorage('learner_progress')
          ->create([
            'type' => $bundle,
            'field_' . $bundle => $id,
          ]);
      }

    } catch(\Exception $e) {
      $message = $this->t('Could get lesson progress entity of type @type (id @id). Error: @error', [
        '@type' => $bundle,
        '@id' => $id,
        '@error' => $e->getMessage(),
      ]);
      $this->logger->critical($message);
      throw new UnprocessableEntityHttpException($message);
    }

    return $entity;
  }

}
