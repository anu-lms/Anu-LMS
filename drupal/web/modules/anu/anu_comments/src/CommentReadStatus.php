<?php
namespace Drupal\anu_comments;

use Drupal\Core\TypedData\TypedData;

/**
 * A property that returns TRUE if current user has read the comment.
 */
class CommentReadStatus extends TypedData {

  /**
   * Is read state.
   *
   * @var int
   */
  protected $value;

  /**
   * @var \Drupal\Core\Field\FieldItemInterface
   */
  protected $parent;

  /**
   * {@inheritdoc}
   */
  public function getValue() {
    if ($this->value === NULL) {
      $existing_entities_amount = \Drupal::entityQuery('paragraph_comment_read')
        ->condition('uid', \Drupal::currentUser()->id())
        ->condition('field_comment', $this->parent->getEntity()->id())
        ->count()
        ->execute();

      $this->value = $existing_entities_amount > 0;
    }
    return $this->value;
  }

}
