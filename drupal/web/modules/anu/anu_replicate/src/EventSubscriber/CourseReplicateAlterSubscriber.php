<?php

namespace Drupal\anu_replicate\EventSubscriber;

use \Drupal\replicate\Events\ReplicatorEvents;
use Drupal\Component\Render\FormattableMarkup;
use \Drupal\replicate\Events\ReplicateAlterEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 *
 */
class CourseReplicateAlterSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      ReplicatorEvents::REPLICATE_ALTER => 'onReplicateAlter'
    ];
  }

  /**
   *
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
      foreach ($replicated_course->field_course_lessons as $course_lesson) {
        if (empty($course_lesson->entity)) {
          continue;
        }
        $course_lesson->entity->field_lesson_course = NULL;
        $replicated_lessons[] = $replicator->replicateEntity($course_lesson->entity);
      }
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
