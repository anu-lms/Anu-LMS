<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\user\Entity\User;
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
    if (!parent::shouldTrigger()) {
      return FALSE;
    }

    // Compare existing mentions and updated, trigger event only for new mentioned users.
    if ($this->hook == 'entity_update') {
      // Get mentioned previously users.
      $recipients = $this->getRecipients();

      // Get updated mentions.
      $original_mentions = [];
      if (!empty($this->entity->original->field_comment_mentions->getValue())) {
        $original_mentions = array_column($this->entity->original->field_comment_mentions->getValue(), 'target_id');
      }

      // Find new mentioned users.
      $this->recipients = array_diff($recipients, $original_mentions);

      if (empty($this->recipients)) {
        return FALSE;
      }
    }

    // Returns TRUE if all conditions above have passed.
    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function shouldNotify($recipientId) {
    if (!parent::shouldNotify($recipientId)) {
      return FALSE;
    }

    // Don't send notifications if user has no access to the lesson where he was mentioned.
    $paragraph_id = $this->entity->field_comment_paragraph->getString();
    $lesson = \Drupal::service('anu_lessons.lesson')->loadByParagraphId($paragraph_id);

    $recipient_account = User::load($recipientId);
    if (!$lesson->access('view', $recipient_account)) {
      return FALSE;
    }

    return TRUE;
  }

  /**
   * Get users who should get notifications.
   */
  protected function getRecipients() {
    // Use 'recipients' property as cache, it will use saved in 'recipients' value instead of recalculate it again.
    if (!empty($this->recipients)) {
      return $this->recipients;
    }

    if (!empty($this->entity->field_comment_mentions->getValue())) {
      $this->recipients = array_column($this->entity->field_comment_mentions->getValue(), 'target_id');
      return $this->recipients;
    }

    return [];
  }

}
