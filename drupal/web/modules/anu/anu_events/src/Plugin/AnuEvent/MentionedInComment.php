<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventCommentBase;

/**
 * Reply to the Comment event.
 *
 * @AnuEvent(
 *   id = "reply_to_comment",
 *   title = @Translation("Reply to comment"),
 *   description = @Translation("Triggered when user replied to the comment"),
 * )
 */
class ReplyToComment extends AnuEventCommentBase {

  /**
   * {@inheritdoc}
   */
  public function shouldTrigger() {
    if (!parent::shouldTrigger()) {
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
  protected function getRecipient() {
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
