<?php
namespace Drupal\anu_comment_read;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;

/**
 * A property returns TRUE if current user has read the comment.
 */
class CommentReadStatus extends FieldItemList {

  use ComputedItemListTrait;

  /**
   * Return TRUE if comment marked as read by current user.
   */
  protected function computeValue() {
    $current_user_uid = (int) \Drupal::currentUser()->id();
    $comment_uid = (int) $this->getParent()->getValue()->uid->getString();

    // Comment marked as read if it's authored by current user.
    if ($comment_uid == $current_user_uid) {
      $value = TRUE;
    }
    else {
      // Make request to comment_read entity, mark comment as Read there is an existing record.
      $existing_entities_amount = \Drupal::entityQuery('paragraph_comment_read')
        ->condition('uid', $current_user_uid)
        ->condition('field_comment', $this->getParent()->getValue()->id())
        ->count()
        ->execute();
      $value = $existing_entities_amount > 0;
    }

    $this->list[0] = $this->createItem(0, $value);
  }

}
