<?php

/**
 * @file
 * Contains \Drupal\anu_events\EventSubscriber.
 */

namespace Drupal\anu_events\EventSubscriber;

use Drupal\anu_events\Event\AnuEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


/**
 * Class EventSubscriber.
 *
 * @package Drupal\anu_events
 */
class EventSubscriber implements EventSubscriberInterface {

  /**
   * Supported channels.
   */
  protected $channels = [
    'frontend_push',
  ];

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[AnuEvents::REPLY_TO_COMMENT][] = ['sendNotification'];
    $events[AnuEvents::ADD_COMMENT_TO_THREAD][] = ['sendNotification'];
    return $events;
  }

  /**
   * Notify every supported channel.
   */
  public function sendNotification($event) {
    foreach ($this->channels as $channel) {
      \Drupal::service('message_notify.sender')->send($event->getMessage(), [], $channel);
    }
  }
}
