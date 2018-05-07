<?php

namespace Drupal\anu_events\Event;

use Drupal\message\Entity\Message;
use Symfony\Component\EventDispatcher\Event;
use \Drupal\Component\Render\FormattableMarkup;


class ReplyToCommentEvent extends Event {

  protected $comment;

  public function __construct($comment) {
    $this->comment = $comment;
  }

  public function getComment() {
    return $this->comment;
  }

  public function createMessage() {
    try {
      /** @var \Drupal\message\Entity\Message $message */
      $message = Message::create([
        'template' => 'reply_to_comment',
        'uid' => (int) $this->comment->uid->target_id,
      ]);
      $message->field_message_comment = $this->comment->id();
      $message->field_message_recipient = $this->comment->field_comment_parent
        ->first()
        ->get('entity')
        ->getValue()
        ->uid
        ->target_id;

      return $message->save();
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not create a message for comment @id. Error: @error', [
        '@id' => $this->comment->id(),
        '@error' => $exception->getMessage()
      ]);
      \Drupal::logger('anu_events')->error($message);
    }

    return FALSE;
  }

}
