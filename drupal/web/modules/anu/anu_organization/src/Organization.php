<?php

namespace Drupal\anu_organization;


/**
 * Helper class for working with organizations.
 *
 * @package Drupal\anu_organization
 */
class Organization {

  /**
   * Returns an amount of users from organization.
   */
  public function getRegisteredUsersAmount($organizationId) {
    $amount = \Drupal::entityQuery('user')
      ->condition('field_organization', $organizationId)
      ->count()
      ->execute();
    return $amount;
  }

  /**
   * Generates onboarding link.
   */
  public function getOnboardingLink($organization) {

    return $organization->id();
  }

}
