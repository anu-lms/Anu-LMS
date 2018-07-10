<?php
namespace Drupal\anu_comments;

use Drupal\Core\TypedData\TypedData;
use Drupal\Core\Language\LanguageInterface;

/**
 * A property returns TRUE if current user has read the comment.
 */
class CommentReadStatus extends TypedData {

  /**
   * The langcode of the field values held in the object.
   *
   * @var string
   */
  protected $langcode = LanguageInterface::LANGCODE_NOT_SPECIFIED;

  /**
   * Is read state.
   *
   * @var int
   */
  protected $value;

  /**
   * {@inheritdoc}
   */
  public function getValue() {
    if ($this->value === NULL) {
      $existing_entities_amount = \Drupal::entityQuery('paragraph_comment_read')
        ->condition('uid', \Drupal::currentUser()->id())
        ->condition('field_comment', $this->getParent()->getValue()->id())
        ->count()
        ->execute();

      $this->value = $existing_entities_amount > 0;
    }
    return $this->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setLangcode($langcode) {
    $this->langcode = $langcode;
  }

  /**
   * {@inheritdoc}
   */
  public function getLangcode() {
    return $this->langcode;
  }

}
