<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventCommentBase;

/**
 * User was mentioned in comment.
 *
 * @AnuEvent(
 *   id = "mentioned_in_comment",
 *   title = @Translation("Mention in comment"),
 *   description = @Translation("Triggered when user was mentioned in comment"),
 * )
 */
class MentionedInComment extends AnuEventCommentBase {

  /**
   * {@inheritdoc}
   */
  public function shouldTrigger() {
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

    if ($this->hook == 'entity_update') {
      $original_mentions = [];
      if (!empty($this->entity->original->field_comment_mentions->getValue())) {
        $original_mentions = array_column($this->entity->original->field_comment_mentions->getValue(), 'target_id');
      }
      $this->recipients = array_diff($recipients, $original_mentions);

      if (empty($this->recipients)) {
        return FALSE;
      }
    }

    // Returns TRUE if all conditions above have passed.
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
      // We shouldn't trigger event if Recipient and Triggerer the same.
      if ($this->getTriggerer() == $recipientId) {
        continue;
      }

      if ($message = $this->createMessage(['field_message_recipient' => (int) $recipientId])) {
        $this->notifyChannels($message);
      }
    }
  }

  /**
   * Get users who should get notifications.
   */
  protected function getRecipients() {
    if (!empty($this->recipients)) {
      return $this->recipients;
    }

    if (!empty($this->entity->field_comment_mentions->getValue())) {
      $this->recipients = array_column($this->entity->field_comment_mentions->getValue(), 'target_id');
      return $this->recipients;
    }

    return [];
  }

  /**
   * {@inheritdoc}
   */
  protected function getRecipient() {
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  protected function attachMessageFields($message) {
    $message->field_message_comment = $this->entity->id();
    $message->field_message_is_read = FALSE;
  }

}
