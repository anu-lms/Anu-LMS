<?php

namespace Drupal\anu_user\Plugin\Validation\Constraint;

use Drupal\Core\Entity\Plugin\Validation\Constraint\CompositeConstraintBase;

/**
 * Additional validation for paragraph_comment entity.
 *
 * @Constraint(
 *   id = "UserOrganizationLimit",
 *   label = @Translation("Validation for organization field if users limit has not been reached", context = "Validation"),
 *   type = "entity:user"
 * )
 */
class UserOrganizationLimitConstraint extends CompositeConstraintBase {

  /**
   * {@inheritdoc}
   */
  public function coversFields() {
    return ['field_organization'];
  }

}
