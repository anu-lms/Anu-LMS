<?php

namespace Drupal\anu_events\Event;

use Drupal\message\Entity\Message;
use Symfony\Component\EventDispatcher\Event;
use \Drupal\Component\Render\FormattableMarkup;

/**
 * An abstract implementation of AnuEvent.
 */
abstract class AnuEvent extends Event {

  /**
   * An entity that triggered the event.
   *
   * @var \Drupal\Core\Entity\EntityInterface
   */
  protected $entity;

  /**
   * Machine name of the event (@see \Drupal\anu_events\Event\AnuEvents for full list).
   *
   * @var string
   */
  protected $event_name;

  /**
   * Machine name of attached Message bundle.
   *
   * @var string
   */
  protected $message_bundle;

  /**
   * An Id of user who has triggered event.
   *
   * @var int
   */
  protected $triggerer;

  /**
   * An Id of user who should be notified.
   *
   * @var int
   */
  protected $recipient;

  /**
   * Attached to the Event Message entity.
   *
   * @var \Drupal\message\Entity\Message
   */
  protected $message;

  public function __construct($entity, $event_name = '', $message_bundle = '') {
    $this->entity = $entity;
    $this->event_name = $event_name;
    $this->message_bundle = $message_bundle;
    $this->triggerer = (int) $entity->uid->target_id;

    // Default value, should be overridden in child classes.
    $this->recipient = (int) $entity->uid->target_id;
  }

  public function getEntity() {
    return $this->entity;
  }

  public function getMessageBundle() {
    return $this->message_bundle;
  }

  public function getTriggerer() {
    return $this->triggerer;
  }

  public function getRecipient() {
    return $this->recipient;
  }

  public function getMessage() {
    return $this->message;
  }

  public function setMessage($message) {
    return $this->message = $message;
  }

  /**
   * Returns true if Event can be triggered.
   */
  public function canBeTriggered() {
    // We shouldn't trigger event if Recipient and Triggerer the same.
    // For example when user replies to his own comment.
    return $this->getTriggerer() !== $this->getRecipient();
  }

  /**
   * Check if event can be triggered, creates Message entity and dispatch itself.
   */
  public function trigger() {
    if (empty($this->event_name)) {
      \Drupal::logger('anu_events')->error('You should define event name in class constructor.');
      return;
    }

    // Check if event can be triggered.
    if (!$this->canBeTriggered()) {
      return;
    }

    // Creates and attaches Message entity to the event.
    if ($this->createMessage()) {
      // Dispatch Event if Message entity has been successfully created.
      \Drupal::service('event_dispatcher')->dispatch($this->event_name, $this);
    }
  }

  /**
   * Attach fields to the Message entity before its creation.
   */
  public function attachMessageFields($message) {
    // We don't need to attach any fields in this class by default.
  }

  /**
   * Creates and attaches Message entity to the event.
   *
   * @return bool
   *   Returns True if Message was successfully created, or False otherwise.
   */
  private function createMessage() {
    if (empty($this->message_bundle)) {
      \Drupal::logger('anu_events')->error('You should define message bundle name in class constructor.');
      return FALSE;
    }

    try {
      /** @var \Drupal\message\Entity\Message $message */
      $message = Message::create([
        'template' => $this->getMessageBundle(),
        'uid' => $this->getTriggerer(),
      ]);

      // Attaches an additional fields to the entity.
      $this->attachMessageFields($message);

      // Save entity.
      $saved_status = $message->save();

      // Attach created entity to the Event.
      $this->setMessage($message);

      return $saved_status == SAVED_NEW;
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not create a message for entity @id. Error: @error', [
        '@id' => $this->entity->id(),
        '@error' => $exception->getMessage()
      ]);
      \Drupal::logger('anu_events')->error($message);
    }

    return FALSE;
  }

}
