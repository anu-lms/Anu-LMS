<?php

namespace Drupal\anu_events;

use Psr\Log\LoggerInterface;

/**
 * Base class for events handling of comments.
 */
abstract class AnuEventCommentBase extends AnuEventBase {

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LoggerInterface $logger, $notifier_manager, $hook = '', array $context = []) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $logger, $notifier_manager, $hook, $context);

    $this->recipients = [];
    $this->entity = !empty($context['entity']) ? $context['entity'] : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function shouldTrigger() {
    // We process only comment insert hook for now, feel free to move to another level in future.
    if (($this->hook !== 'entity_insert' && $this->hook !== 'entity_update') || empty($this->entity)) {
      return FALSE;
    }

    if ($this->entity->getEntityTypeId() !== 'paragraph_comment' || $this->entity->bundle() !== 'paragraph_comment') {
      return FALSE;
    }

    $recipients = $this->getRecipients();
    if (empty($recipients)) {
      return FALSE;
    }

    return TRUE;
  }

  /**
   * Check if recipient should be notified.
   */
  protected function shouldNotify($recipientId) {
    if (empty($recipientId)) {
      return FALSE;
    }

    // We shouldn't trigger event if Recipient and Triggerer the same.
    if ($this->getTriggerer() == $recipientId) {
      return FALSE;
    }
    return TRUE;
  }

  /**
   * Check if event can be triggered, creates Message entity and dispatch itself.
   */
  public function trigger() {
    // Check if event can be triggered.
    if (!$this->shouldTrigger()) {
      return;
    }

    // Creates Message entity for the event.
    $recipients = $this->getRecipients();
    foreach ($recipients as $recipientId) {
      if (!$this->shouldNotify($recipientId)) {
        continue;
      }

      $message_values = [
        'field_message_recipient' => (int) $recipientId,
        'field_message_comment' => $this->entity->id(),
        'field_message_is_read' => FALSE,
      ];
      if ($message = $this->createMessage($message_values)) {
        $this->notifyChannels($message);
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  protected function getMessageBundle() {
    // Use plugin Id as message bundle name by default.
    return $this->pluginId;
  }

  /**
   * {@inheritdoc}
   */
  protected function getTriggerer() {
    return (int) $this->entity->uid->target_id;
  }

  /**
   * Returns IDs of users who should receive notification.
   */
  protected function getRecipients() {
    return $this->recipients;
  }

}
