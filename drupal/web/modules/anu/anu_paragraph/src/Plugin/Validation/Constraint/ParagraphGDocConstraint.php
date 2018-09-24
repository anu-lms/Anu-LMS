<?php

namespace Drupal\anu_paragraph\Plugin\Validation\Constraint;

use Drupal\Core\Entity\Plugin\Validation\Constraint\CompositeConstraintBase;

/**
 * Additional validation for gdoc link field in google document paragraph entity.
 *
 * @Constraint(
 *   id = "ParagraphGDoc",
 *   label = @Translation("Additional validation for gdoc link field in google document paragraph entity", context = "Validation"),
 *   type = "entity:paragraph"
 * )
 */
class ParagraphGDocConstraint extends CompositeConstraintBase {

  /**
   * {@inheritdoc}
   */
  public function coversFields() {
    return ['field_paragraph_gdoc_link'];
  }

}
