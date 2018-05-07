<?php

namespace Drupal\anu_events\Event;

use Drupal\message\Entity\Message;
use \Drupal\Component\Render\FormattableMarkup;


class ReplyToCommentEvent extends AnuEvent {

  public function __construct($entity, $template_name = '') {
    parent::__construct($entity, 'reply_to_comment');
  }

  public function createMessage() {
    try {
      $comment = $this->entity;

      /** @var \Drupal\message\Entity\Message $message */
      $message = Message::create([
        'template' => $this->template_name,
        'uid' => (int) $comment->uid->target_id,
      ]);
      $message->field_message_comment = $comment->id();
      $message->field_message_recipient = $comment->field_comment_parent
        ->first()
        ->get('entity')
        ->getValue()
        ->uid
        ->target_id;
      $saved_status = $message->save();

      $this->setMessage($message);

      return $saved_status == SAVED_NEW;
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not create a message for comment @id. Error: @error', [
        '@id' => $comment->id(),
        '@error' => $exception->getMessage()
      ]);
      \Drupal::logger('anu_events')->error($message);
    }

    return FALSE;
  }

}
