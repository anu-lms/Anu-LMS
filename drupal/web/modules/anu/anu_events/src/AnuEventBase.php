<?php

namespace Drupal\anu_events;

use Drupal\message\Entity\Message;
use Drupal\Component\Plugin\PluginBase;
use Drupal\Component\Render\FormattableMarkup;

abstract class AnuEventBase extends PluginBase implements AnuEventInterface {

  /**
   * Returns true if Event can be triggered.
   */
  public abstract function shouldTrigger($hook, $context);

  /**
   * Returns true if Event can be triggered.
   */
  protected abstract function getMessageBundle();

  /**
   * Returns true if Event can be triggered.
   */
  protected abstract function getTriggerer();

  /**
   * Check if event can be triggered, creates Message entity and dispatch itself.
   */
  public function trigger($hook, $context) {
    // Check if event can be triggered.
    if (!$this->shouldTrigger($hook, $context)) {
      return;
    }

    // Creates Message entity for the event.
    if ($message = $this->createMessage()) {
      $this->notifyChannels($message);
    }
  }

  /**
   * @param $message
   */
  private function notifyChannels($message) {
    $notifier_service = \Drupal::service('plugin.message_notify.notifier.manager');
    $notifier_plugins = $notifier_service->getDefinitions();

    foreach ($notifier_plugins as $notifier_plugin) {
      $notifier = $notifier_service->createInstance($notifier_plugin['id'], [], $message);

      if ($notifier->access()) {
        $notifier->send();
      }
    }
  }

  /**
   * Attach fields to the Message entity before its creation.
   */
  protected function attachMessageFields($message) {
    // We don't need to attach any fields in this class by default.
  }

  /**
   * Creates and attaches Message entity to the event.
   *
   * @return object
   *   Returns True if Message was successfully created, or False otherwise.
   */
  private function createMessage() {
    if (empty($this->message_bundle)) {
      \Drupal::logger('anu_events')->error('You should define message bundle name in class constructor.');
      return NULL;
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

      return $saved_status == SAVED_NEW ? $message : NULL;
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not create a message. Error: @error', [
        '@error' => $exception->getMessage()
      ]);
      \Drupal::logger('anu_events')->error($message);
    }

    return NULL;
  }

}
