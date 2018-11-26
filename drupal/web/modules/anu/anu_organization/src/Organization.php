<?php

namespace Drupal\anu_organization;


/**
 * Helper class for working with organizations.
 *
 * @package Drupal\anu_organization
 */
class Organization {

  /**
   *
   */
  public function getRegisteredUsersAmount($organizationId) {

    return $organizationId;
  }

  /**
   *
   */
  public function getOnboardingLink($organization) {

    return $organization->id();
  }

}
