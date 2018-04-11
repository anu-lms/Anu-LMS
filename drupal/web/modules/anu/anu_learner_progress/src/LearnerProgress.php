<?php

namespace Drupal\anu_learner_progress;

use Drupal\Component\Render\FormattableMarkup;

class LearnerProgress {

  public function load() {
    $progress = [];

    try {

      // Get list of progress per lessons for the current user.
      $lesson_progress_entities = \Drupal::entityTypeManager()
        ->getStorage('learner_progress')
        ->loadByProperties([
          'type' => 'lesson',
          'uid' => \Drupal::currentUser()->id(),
        ]);

      // Build an array of lesson progress entities where the key is lesson
      // ID. It's needed for easier matching of entities later.
      $lesson_progresses = [];
      foreach ($lesson_progress_entities as $lesson_progress_entity) {
        $lesson = $lesson_progress_entity->get('field_lesson')->getValue();
        if (!empty($lesson[0]['target_id'])) {
          $lesson_progresses[$lesson[0]['target_id']] = $lesson_progress_entity;
        }
      }

      if (!empty($lesson_progresses)) {

        // Load course nodes for all lessons with the progress. It is needed
        // to figure out what lessons belong to what courses, in order to
        // calculate progress per course.
        $entities = \Drupal::entityTypeManager()
          ->getStorage('node')
          ->loadByProperties([
            'type' => 'course',
            'field_course_lessons' => array_keys($lesson_progresses)
          ]);

        // Build an array of courses where array key is node ID. It's needed for
        // easier matching of entities later.
        $courses = [];
        foreach ($entities as $entity) {
          $courses[$entity->id()] = $entity;
        }

        // Load entity with progress per course. These entities are needed
        // in order to figure out which lesson was accessed the last for
        // each course.
        $course_progresses = \Drupal::entityTypeManager()
          ->getStorage('learner_progress')
          ->loadByProperties([
            'type' => 'course',
            'field_course' => array_keys($courses),
            'uid' => \Drupal::currentUser()->id(),
          ]);

        foreach ($course_progresses as $course_progress) {

          // Add recently accessed lesson id and url to the output.
          $recent_lesson = [];
          $recent_lesson_entity = $course_progress->get('field_lesson')->entity;
          if (!empty($recent_lesson_entity)) {

            // Fetch lesson's path alias.
            $path = \Drupal::service('path.alias_manager')
              ->getAliasByPath('/node/' . $recent_lesson_entity->id());

            $recent_lesson = [
              'lessonId' => $recent_lesson_entity->id(),
              'url' => $path,
              'timestamp' => $course_progress->changed->first()->getValue()['value']
            ];
          }

          // Get course node corresponding to the current course progress
          // entity.
          $field_course = $course_progress->field_course->getValue();
          $course = $courses[$field_course[0]['target_id']];

          // Figure out what lessons belong to the course. We need to know
          // how much lessons there are and what they are in order to
          // calculate progress precisely.
          $course_lessons = $course->get('field_course_lessons')->getValue();
          $course_lessons_ids = [];
          foreach ($course_lessons as $course_lesson) {
            $course_lessons_ids[] = $course_lesson['target_id'];
          }

          // Figure out how much each lesson can add to the overall course
          // progress in case if lesson's progress is 100%.
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
      $message = new FormattableMarkup('Could not obtain learner progress. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      \Drupal::logger('anu_learner_progress')->critical($message);
    }

    return $progress;
  }

}
