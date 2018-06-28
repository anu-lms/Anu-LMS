<?php

namespace Drupal\anu_comments\Plugin\Validation\Constraint;

use Drupal\Core\Entity\Plugin\Validation\Constraint\CompositeConstraintBase;

/**
 * Additional validation for paragraph_comment entity.
 *
 * @Constraint(
 *   id = "ParagraphComment",
 *   label = @Translation("Additional validation for paragraph_comment entity", context = "Validation"),
 *   type = "entity:paragraph_comment"
 * )
 */
class ParagraphCommentConstraint extends CompositeConstraintBase {

  /**
   * {@inheritdoc}
   */
  public function coversFields() {
    return ['field_comment_parent', 'field_comment_paragraph'];
  }

}
