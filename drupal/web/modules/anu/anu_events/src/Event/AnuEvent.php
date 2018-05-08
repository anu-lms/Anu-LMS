<?php

namespace Drupal\anu_events\Event;

use Drupal\message\Entity\Message;
use Symfony\Component\EventDispatcher\Event;
use \Drupal\Component\Render\FormattableMarkup;

/**
 * An abstract implementation of MessageNotifierObject.
 */
abstract class AnuEvent extends Event {

  protected $entity;

  protected $event_name;

  protected $message_bundle;

  protected $triggerer;

  protected $recipient;

  protected $message;

  public function __construct($entity, $event_name = '', $message_bundle = '') {
    $this->entity = $entity;
    $this->event_name = $event_name;
    $this->message_bundle = $message_bundle;
    $this->triggerer = (int) $entity->uid->target_id;
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

  public function canBeTriggered() {
    return !empty($this->recipient) && $this->getTriggerer() !== $this->getRecipient();
  }

  public function trigger() {
    if (empty($this->event_name)) {
      throw new \Exception('You should define event name in class constructor.');
    }

    if (!$this->canBeTriggered()) {
      return;
    }

    if ($this->createMessage()) {
      \Drupal::service('event_dispatcher')->dispatch($this->event_name, $this);
    }
  }

  public function attachMessageFields($message) {
    // We don't need to attach any fields in this class by default.
  }

  public function createMessage() {
    if (empty($this->message_bundle)) {
      throw new \Exception('You should define template name in class constructor.');
    }

    try {
      /** @var \Drupal\message\Entity\Message $message */
      $message = Message::create([
        'template' => $this->getMessageBundle(),
        'uid' => $this->getTriggerer(),
      ]);

      $this->attachMessageFields($message);

      $saved_status = $message->save();

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
