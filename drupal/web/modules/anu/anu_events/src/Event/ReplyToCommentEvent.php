<?php

namespace Drupal\anu_events\Event;

use \Drupal\Component\Render\FormattableMarkup;

class ReplyToCommentEvent extends AnuEvent {

  public function __construct($entity, $template_name = '') {
    parent::__construct($entity, AnuEvents::REPLY_TO_COMMENT,'reply_to_comment');

    try {
      $this->recipient = (int) $this->entity->field_comment_parent
        ->first()
        ->get('entity')
        ->getValue()
        ->uid
        ->target_id;
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not set notification recipient for comment @id. Error: @error', [
        '@id' => $this->entity->id(),
        '@error' => $exception->getMessage()
      ]);
      \Drupal::logger('anu_events')->error($message);
    }
  }

  public function attachMessageFields($message) {
    $comment = $this->getEntity();
    $message->field_message_comment = $comment->id();
    $message->field_message_recipient = $this->getRecipient();
  }

}
