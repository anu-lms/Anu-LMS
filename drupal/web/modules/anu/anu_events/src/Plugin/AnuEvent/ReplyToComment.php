<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Reply to the Comment event.
 *
 * @AnuEvent(
 *   id = "reply_to_comment",
 *   title = @Translation("Reply to comment"),
 *   description = @Translation("Triggered when user replied to the comment"),
 * )
 */
class ReplyToComment extends AnuEventBase {

  /**
   *
   */
  const MESSAGE_BUNDLE = 'reply_to_comment';

  function shouldTrigger($hook, $context) {
    if ($hook !== 'entity_insert' || empty($context['entity'])) {
      return FALSE;
    }

    $entity = $context['entity'];
    if ($entity->type() !== 'paragraph_comment' || $entity->bundle() !== 'paragraph_comment') {
      return FALSE;
    }

    // We shouldn't trigger event if Recipient and Triggerer the same.
    // For example when user replies to his own comment.
    return $this->getTriggerer() !== $this->getRecipient();
  }

  protected function getTriggerer() {
    return (int) $entity->uid->target_id;
  }

  protected function getMessageBundle() {
    return self::MESSAGE_BUNDLE;
  }

  protected function getRecipient() {
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

  protected function attachMessageFields($message) {
    $comment = $this->getEntity();
    $message->field_message_comment = $comment->id();
    $message->field_message_recipient = $this->getRecipient();
  }
}
