<?php

namespace Drupal\anu_events;

use Drupal\Component\Render\FormattableMarkup;

/**
 * Class for working with notification messages.
 */
class Message {

  /**
   * Deletes message entities created for comment with given Id.
   */
  public function deleteByCommentId($commentId) {
    try {
      // Load paragraphs of the resource type for course lessons.
      $entities = \Drupal::entityTypeManager()
        ->getStorage('message')
        ->loadByProperties([
          'field_message_comment' => $commentId,
        ]);

      // Delete all existing notifications for deleted comment.
      $controller = \Drupal::entityTypeManager()->getStorage('message');
      $controller->delete($entities);

    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not remove notifications for deleted comment with id @comment_id. Error: @error', [
        '@comment_id' => $commentId,
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_events')->error($message);
    }
  }

}
