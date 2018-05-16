<?php

namespace Drupal\anu_events\Event;

class AddCommentToThreadEvent extends AnuEvent {

  /**
   * {@inheritdoc}
   */
  public function __construct($entity, $template_name = '') {
    parent::__construct($entity, AnuEvents::ADD_COMMENT_TO_THREAD, 'add_comment_to_thread');

    // Search for the root parent comment.
    $rootComment = anu_comments_paragraph_comment_get_root_comment($this->entity);
    $this->recipient = (int) $rootComment->uid->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function attachMessageFields($message) {
    $comment = $this->getEntity();
    $message->field_message_comment = $comment->id();
    $message->field_message_recipient = $this->getRecipient();
    $message->field_message_is_read = false;
  }
}
