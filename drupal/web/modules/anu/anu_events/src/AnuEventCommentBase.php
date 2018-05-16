<?php

namespace Drupal\anu_events;

use Psr\Log\LoggerInterface;

abstract class AnuEventCommentBase extends AnuEventBase {

  /**
   * Returns ID of user who should receive notification.
   */
  abstract protected function getRecipient();

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LoggerInterface $logger, $notifier_manager, $hook = '', array $context = []) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $logger, $notifier_manager, $hook, $context);

    $this->entity = !empty($context['entity']) ? $context['entity'] : NULL;
  }

  /**
   * {@inheritdoc}
   */
  function shouldTrigger() {
    // We process only comment insert hook for now, feel free to move to another level in future.
    if ($this->hook !== 'entity_insert' || empty($this->entity)) {
      return FALSE;
    }

    if ($this->entity->getEntityTypeId() !== 'paragraph_comment' || $this->entity->bundle() !== 'paragraph_comment') {
      return FALSE;
    }

    // We shouldn't trigger event if Recipient and Triggerer the same.
    // For example when user replies to his own comment.
    return $this->getTriggerer() !== $this->getRecipient();
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
   * {@inheritdoc}
   */
  protected function attachMessageFields($message) {
    $message->field_message_comment = $this->entity->id();
    $message->field_message_recipient = $this->getRecipient();
  }
}
