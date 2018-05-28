<?php

namespace Drupal\anu_events;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\anu_normalizer\AnuNormalizerBase;

class Message {

  /**
   * Returns an object prepared to pass to frontend from given Message entity.
   */
  public function normalize($message) {
    $response_item = NULL;
    try {
      // Prepared common comment data.
      $response_item = [
        'id' => (int) $message->id(),
        'uuid' => $message->uuid(),
        'bundle' => $message->bundle(),
        'created' => (int) $message->created->getString(),
        'triggerer' => $message->uid->first()->get('entity')->getValue(),
        'isRead' => (bool) $message->field_message_is_read->getString(),
      ];

      // Always add a recipient user ID to the message item.
      if ($message->hasField('field_message_recipient')) {
        if (!empty($message->field_message_recipient->getValue())) {
          $value = $message->field_message_recipient->first()->getValue();
          $response_item['recipient'] = $value['target_id'];
        }
      }

      // Prepares Comment part if Comment field exists.
      if ($message->hasField('field_message_comment')) {
        $comment = $message->field_message_comment->first()->get('entity')->getValue();
        $response_item['comment'] = AnuNormalizerBase::normalizeEntity($comment, ['lesson']);
      }
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize message entity. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      \Drupal::logger('anu_events')->critical($message);
    }

    return $response_item;
  }

  /**
   * Deletes message entities created for comment with given Id.
   */
  public function deleteByCommentId($commentId) {
    try {
      // Load paragraphs of the resource type for course lessons.
      $entities = \Drupal::entityTypeManager()
        ->getStorage('message')
        ->loadByProperties([
          'field_message_comment' => $commentId
        ]);

      // Delete all existing notifications for deleted comment.
      $controller = \Drupal::entityTypeManager()->getStorage('message');
      $controller->delete($entities);

    } catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not remove notifications for deleted comment with id @comment_id. Error: @error', [
        '@comment_id' => $commentId,
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_events')->error($message);
    }
  }
}
