<?php

namespace Drupal\anu_replicate\EventSubscriber;

use Drupal\replicate\Events\ReplicatorEvents;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\replicate\Events\AfterSaveEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * The Event Subscriber for Replicated entities.
 */
class CourseReplicateAfterSaveSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      ReplicatorEvents::AFTER_SAVE => 'onReplicateAfterSave',
    ];
  }

  /**
   * This event is fired after the entire entity got replicated and saved.
   *
   * @param \Drupal\replicate\Events\AfterSaveEvent $event
   *   Event object.
   */
  public function onReplicateAfterSave(AfterSaveEvent $event) {
    if ($event->getEntity()->getEntityTypeId() != 'node' || $event->getEntity()->bundle() != 'course') {
      return;
    }

    // Updates course field to the replicated course in recently.
    try {
      $replicated_course = $event->getEntity();

      // Update course id to replicated course in every replicated lesson.
      foreach ($replicated_course->field_course_lessons as $course_lesson) {
        if (empty($course_lesson->entity)) {
          continue;
        }
        $course_lesson->entity->field_lesson_course = $replicated_course->id();
        $course_lesson->entity->save();
      }
    }
    catch (\Exception $e) {
      $message = new FormattableMarkup('There is a problem to update course in lessons for course with id @uid. Error: @error', [
        '@id' => $replicated_course->id(),
        '@error' => $e->getMessage(),
      ]);
      \Drupal::logger('anu_user')->error($message);
    }
  }

}
