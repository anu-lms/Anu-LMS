<?php

namespace Drupal\anu_comments;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Core\Entity\EntityInterface;

/**
 * Helper service for comment entity.
 */
class Comment {

  /**
   * Looking for root parent comment recursively.
   */
  public function getRootComment($comment) {
    if (!empty($comment->field_comment_parent->getValue())) {
      $parent = $comment->field_comment_parent
        ->first()
        ->get('entity')
        ->getValue();

      return $this->getRootComment($parent);
    }

    return $comment;
  }

  /**
   * Push comment entity to the socket.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   Comment entity.
   * @param string $action
   *   Action, can be `insert`, `update` or `delete`.
   */
  public function pushEntity(EntityInterface $entity, $action) {

    try {

      // Prepare comment entity to send to frontend.
      $normalizedEntity = AnuNormalizerBase::normalizeEntity($entity, ['lesson', 'uid']);

      // isRead value in pushed comment calculated regarding user who pushed it.
      // Current user pushes comment to other users, the value will be wrong
      // for other users because it's calculated for the current user.
      // We say New pushed comment is always unread for other users by default.
      if ($action == 'insert') {
        $normalizedEntity['isRead'] = FALSE;
      }

      if (!$normalizedEntity) {
        throw new \Exception("Entity can't be normalized.");
      }

      // Prepares data to push.
      $data = [
        'action' => $action,
        'data' => $normalizedEntity,
      ];
      \Drupal::service('anu_websocket.websocket')->emit('comment', $data);
    }
    catch (\Exception $exception) {

      \Drupal::logger('anu_comments')
        ->critical('Could not write entity to socket. Error: @error', [
          '@error' => $exception->getMessage(),
        ]);
    }
  }

}
