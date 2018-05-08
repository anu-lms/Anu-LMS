<?php

namespace Drupal\anu_events\Event;

class ReplyToCommentEvent extends AnuEvent {

  public function __construct($entity, $template_name = '') {
    parent::__construct($entity, AnuEvents::REPLY_TO_COMMENT,'reply_to_comment');
    $this->recipient = (int) $this->entity->field_comment_parent
      ->first()
      ->get('entity')
      ->getValue()
      ->uid
      ->target_id;
  }

  public function attachMessageFields($message) {
    $comment = $this->getEntity();
    $message->field_message_comment = $comment->id();
    $message->field_message_recipient = $this->getRecipient();
  }

}
