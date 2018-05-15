<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventCommentBase;

/**
 * Reply to the Comment event.
 *
 * @AnuEvent(
 *   id = "add_comment_to_thread",
 *   title = @Translation("Reply to comment"),
 *   description = @Translation("Triggered when user replied to the comment"),
 * )
 */
class AddCommentToThread extends AnuEventCommentBase {

  function shouldTrigger() {

    if (!parent::shouldTrigger()) {
      return FALSE;
    }

    // When someone replies to user's comment in his thread, we should send notification only about reply,
    // so skip sending notification about comment added in thread in that case.
    if ($this->getParentCommentUid() === $this->getRecipient()) {
      return FALSE;
    }

    // Returns TRUE if all conditions above have passed.
    return TRUE;
  }

  protected function getRecipient() {

    // Search for the root parent comment.
    $rootComment = \Drupal::service('anu_comments.comment')->getRootComment($this->entity);
    return (int) $rootComment->uid->target_id;
  }

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
