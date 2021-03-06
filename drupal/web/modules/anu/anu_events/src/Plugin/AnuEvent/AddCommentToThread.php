<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventCommentBase;

/**
 * Add comment to thread event.
 *
 * @AnuEvent(
 *   id = "add_comment_to_thread",
 *   title = @Translation("Add comment to thread"),
 *   description = @Translation("Triggered when user added comment to the thread of another user"),
 * )
 */
class AddCommentToThread extends AnuEventCommentBase {

  /**
   * {@inheritdoc}
   */
  public function shouldTrigger() {
    if (!parent::shouldTrigger()) {
      return FALSE;
    }

    // Should be triggered only on comment insert hook.
    if ($this->hook !== 'entity_insert') {
      return FALSE;
    }

    // Catch only replies.
    if (empty($this->entity->field_comment_parent->getValue())) {
      return FALSE;
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

    // When someone replies to user's comment in his thread, we should send notification only about reply,
    // so skip sending notification about comment added in thread in that case.
    if ($this->getParentCommentUid() === $recipientId) {
      return FALSE;
    }

    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  protected function getRecipients() {
    // Use 'recipients' property as cache, it will use saved in 'recipients' value instead of recalculate it again.
    if (!empty($this->recipients)) {
      return $this->recipients;
    }

    // Search for the root parent comment.
    $rootComment = \Drupal::service('anu_comments.comment')->getRootComment($this->entity);
    if (!empty($rootComment->uid->target_id)) {
      $this->recipients = [(int) $rootComment->uid->target_id];
      return $this->recipients;
    }

    return [];
  }

  /**
   * Returns id of parent comment author.
   */
  private function getParentCommentUid() {
    if (!empty($this->entity->field_comment_parent->getValue())) {
      return (int) $this->entity->field_comment_parent
        ->first()
        ->get('entity')
        ->getValue()
        ->uid
        ->target_id;
    }
    return NULL;
  }

}
