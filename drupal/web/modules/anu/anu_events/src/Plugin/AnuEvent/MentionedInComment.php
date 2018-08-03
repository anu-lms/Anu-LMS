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
