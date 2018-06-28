<?php

namespace Drupal\anu_comments;

/**
 *
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

}
