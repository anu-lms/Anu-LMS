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

  protected $message;

  protected $template_name;

  protected $event_name;

  public function __construct($entity, $event_name = '', $template_name = '') {
    $this->entity = $entity;
    $this->event_name = $event_name;
    $this->template_name = $template_name;
  }

  public function getComment() {
    return $this->entity;
  }

  public function getMessage() {
    return $this->message;
  }

  public function setMessage($message) {
    return $this->message = $message;
  }

  public function canBeTriggered() {
    return TRUE;
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

  public function createMessage() {
    if (empty($this->template_name)) {
      throw new \Exception('You should define template name in class constructor.');
    }

    try {
      /** @var \Drupal\message\Entity\Message $message */
      $message = Message::create([
        'template' => $this->template_name,
        'uid' => (int) $this->entity->uid->target_id,
      ]);
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
