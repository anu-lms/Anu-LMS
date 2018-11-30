<?php

namespace Drupal\anu_user\Plugin\Validation\Constraint;

use Drupal\Component\Render\FormattableMarkup;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the UserOrganizationLimit constraint.
 */
class UserOrganizationLimitConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($entity, Constraint $constraint) {
    if (!isset($entity)) {
      return;
    }

    // Administrators can skip organizations limit.
    if (\Drupal::currentUser()->hasPermission('skip organizations limit')) {
      return;
    }

    // New users can't be added to organization with reached limit of users.
    if ($entity->isNew() && $entity->hasField('field_organization')) {
      $organizations = $entity->field_organization->referencedEntities();

      foreach ($organizations as $organization) {
        $limit = (int) $organization->field_organization_limit->getString();
        $amount = \Drupal::service('anu_organization.organization')->getRegisteredUsersAmount($organization->id());

        // Show a validation error if limit reached.
        if ($amount >= $limit) {
          $message = 'Organization @label has reached limit of users. Please contact site administrator.';
          $params = ['@label' => $organization->label()];

          // Output an error.
          $this->context->buildViolation($message, $params)
            ->addViolation();

          \Drupal::logger('anu_user')->warning(new FormattableMarkup($message, $params));
        }
      }
    }
  }

}
