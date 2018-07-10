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
   * Compute the values.
   */
  protected function computeValue() {
    $existing_entities_amount = \Drupal::entityQuery('paragraph_comment_read')
      ->condition('uid', \Drupal::currentUser()->id())
      ->condition('field_comment', $this->getParent()->getValue()->id())
      ->count()
      ->execute();
    $value = $existing_entities_amount > 0;
    $this->list[0] = $this->createItem(0, $value);
  }

}
