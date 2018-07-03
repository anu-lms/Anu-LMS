<?php

namespace Drupal\anu_courses;

use Drupal\Component\Utility\Xss;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\Entity\Node;

/**
 * Helper class for working with course nodes.
 *
 * @package Drupal\anu_courses
 */
class Course {

  /**
   * Loads the course data with current user progress info.
   */
  public function loadWithProgress($id) {
    $progress = [];

    /** @var \Drupal\node\NodeInterface $course */
    $course = Node::load($id);

    /** @var \Drupal\Core\Path\AliasManagerInterface $path_manager */
    $path_manager = \Drupal::service('path.alias_manager');

    try {
      // Fetch learner's progress for the requested course and its lessons.
      /* @var $learnerProgress \Drupal\anu_learner_progress\LearnerProgress */
      $learnerProgress = \Drupal::service('anu_learner_progress.learner_progress');
      $progress = $learnerProgress->loadDetailed($id);

    }
    catch (\Exception $exception) {
      $message = sprintf('Could not fetch learner progress for course %d. Error: %s', $course->id(), $exception->getMessage());
      \Drupal::logger('anu_courses')->critical($message);
    }

    try {

      // Start building the response array.
      $data = [];
      $data['id'] = (int) $course->id();
      $data['created'] = $course->getCreatedTime();
      $data['title'] = $course->getTitle();
      $data['url'] = $path_manager->getAliasByPath('/node/' . $course->id());

      // Current learner's progress for the whole course.
      $data['progress'] = !empty($progress['course']) ? round($progress['course']) : 0;

      // Recently accessed lesson by the current user.
      if (!empty($progress['recentLesson'])) {
        $data['recentLesson'] = $progress['recentLesson'];
      }

      $data['description'] = '';
      if ($course->hasField('field_course_description')) {
        $value = $course->get('field_course_description')->value;
        $data['description'] = Xss::filter($value);
      }

      $data['organisation'] = '';
      if ($course->hasField('field_course_organisation')) {
        $list = [];
        $organizations = $course->get('field_course_organisation')->referencedEntities();
        foreach ($organizations as $organization) {
          /** @var \Drupal\taxonomy\TermInterface $organization */
          $list[] = $organization->getName();
        }
        $data['organisation'] = implode(', ', $list);
      }

      $data['totalMinutes'] = 0;
      if ($course->hasField('field_time_to_complete_minutes')) {
        $value = $course->get('field_time_to_complete_minutes')->getString();
        $data['totalMinutes'] = (int) $value;
      }

      $data['hasResources'] = FALSE;
      if ($course->hasField('field_course_has_resources')) {
        $value = $course->get('field_course_has_resources')->getString();
        $data['hasResources'] = (bool) $value;
      }

      $data['instructors'] = [];
      if ($course->hasField('field_course_instructors')) {
        $instructors = $course->get('field_course_instructors')->referencedEntities();

        /** @var \Drupal\user\UserInterface $instructor */
        foreach ($instructors as $instructor) {
          $name = '';
          if ($instructor->hasField('field_first_name')) {
            $name = $instructor->get('field_first_name')->getString();
          }
          if ($instructor->hasField('field_last_name')) {
            $value = $instructor->get('field_last_name')->getString();
            $name = empty($name) ? $value : $name . ' ' . $value;
          }

          // Fallback to the user account name.
          $name = !empty($name) ? $name : $instructor->getAccountName();
          $data['instructors'][] = $name;
        }
      }

      $data['lessons'] = [];
      if ($course->hasField('field_course_lessons')) {
        $lessons = $course->get('field_course_lessons')->referencedEntities();
        /** @var \Drupal\node\NodeInterface $lesson */
        foreach ($lessons as $lesson) {
          if ($lesson->access('view')) {
            $data['lessons'][] = [
              'id' => (int) $lesson->id(),
              'title' => $lesson->getTitle(),
              'url' => $path_manager->getAliasByPath('/node/' . $lesson->id()),
              'progress' => !empty($progress['lessons'][$lesson->id()]) ? round($progress['lessons'][$lesson->id()]) : 0,
            ];
          }
        }
      }

      $data['coverImage'] = '';
      if ($course->hasField('field_course_image')) {
        $files = $course->get('field_course_image')->referencedEntities();
        if (!empty($files[0])) {
          /** @var \Drupal\file\FileInterface $file */
          $file = $files[0];
          $data['coverImage'] = ImageStyle::load('576x450')->buildUrl($file->getFileUri());
        }
      }

    }
    catch (\Exception $exception) {
      $message = sprintf('Could not load course %d. Error: %s', $course->id(), $exception->getMessage());
      \Drupal::logger('anu_courses')->critical($message);
    }

    return $data;
  }

}
