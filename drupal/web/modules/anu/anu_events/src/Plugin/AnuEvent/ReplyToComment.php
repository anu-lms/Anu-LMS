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
  protected function getRecipients() {
    // Use 'recipients' property as cache, it will use saved in 'recipients' value instead of recalculate it again.
    if (!empty($this->recipients)) {
      return $this->recipients;
    }

    if (!empty($this->entity->field_comment_parent->getValue())) {
      $this->recipients = [
        (int) $this->entity->field_comment_parent
          ->first()
          ->get('entity')
          ->getValue()
          ->uid
          ->target_id,
      ];

      return $this->recipients;
    }
    return [];
  }

}
