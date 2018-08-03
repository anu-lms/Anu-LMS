<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventCommentBase;

/**
 * User was mentioned in comment.
 *
 * @AnuEvent(
 *   id = "mentioned_in_comment",
 *   title = @Translation("Add comment to thread"),
 *   description = @Translation("Triggered when user added comment to the thread of another user"),
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

    // When someone replies to user's comment in his thread, we should send notification only about reply,
    // so skip sending notification about comment added in thread in that case.
    if ($this->getParentCommentUid() === $this->getRecipient()) {
      return FALSE;
    }

    // Returns TRUE if all conditions above have passed.
    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  protected function getRecipient() {

    // Search for the root parent comment.
    $rootComment = \Drupal::service('anu_comments.comment')->getRootComment($this->entity);
    return (int) $rootComment->uid->target_id;
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
