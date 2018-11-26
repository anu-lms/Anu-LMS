<?php

namespace Drupal\anu_replicate\EventSubscriber;

use Drupal\replicate\Events\ReplicatorEvents;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\replicate\Events\ReplicateAlterEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * The Event Subscriber for Replicated entities.
 */
class CourseReplicateAlterSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      ReplicatorEvents::REPLICATE_ALTER => 'onReplicateAlter',
    ];
  }

  /**
   * Event is fired after the entire entity got replicated but before it is saved.
   *
   * Replicate course's lessons.
   *
   * @param \Drupal\replicate\Events\ReplicateAlterEvent $event
   *   Event object.
   */
  public function onReplicateAlter(ReplicateAlterEvent $event) {
    if ($event->getEntity()->getEntityTypeId() != 'node' || $event->getEntity()->bundle() != 'course') {
      return;
    }

    try {
      $replicated_course = $event->getEntity();

      /** @var \Drupal\replicate\Replicator $replicator */
      $replicated_lessons = [];
      $replicator = \Drupal::service('replicate.replicator');

      // Replicate lessons.
      foreach ($replicated_course->field_course_lessons as $course_lesson) {
        if (empty($course_lesson->entity)) {
          continue;
        }
        // Remove old course from the lesson that will be replicated.
        // New Course will be assigned to lesson in onReplicateAfterSave when we know id of replicated course.
        $course_lesson->entity->field_lesson_course = NULL;

        // Replicates lesson entity.
        $replicated_lessons[] = $replicator->replicateEntity($course_lesson->entity);
      }

      // Assign replicated lessons to replicated course.
      $replicated_course->field_course_lessons = $replicated_lessons;
    }
    catch (\Exception $e) {
      $message = new FormattableMarkup('There is a problem to replicate lessons for course with id @uid. Error: @error', [
        '@id' => $replicated_course->id(),
        '@error' => $e->getMessage(),
      ]);
      \Drupal::logger('anu_user')->error($message);
    }
  }

}
