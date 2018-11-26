<?php

namespace Drupal\anu_organization;

use Drupal\Core\Link;
use Drupal\Core\Url;

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
    // hash with stored in db keyword.
    // organization=6+9997&classes=12+34+54 => hash to => asd324fsasd235cssa23fasd3
    $link = Url::fromUri(
      'http://app.docker.localhost/user/register',
      ['query' => ['token' => $organization->uuid()]]
    );
    return Link::fromTextAndUrl(
      $link->toString(),
      $link
    )->toString();
  }

  /**
   * Returns organization id fetched from onboarding link.
   */
  public function getOrganizationFromOnboardingLink($link) {
    $term = \Drupal::service('entity.repository')->loadEntityByUuid('taxonomy_term', '0d5ec336-2b88-446f-bdc7-0ea9a64f6152');
    $organizationId = 9997;
    return $organizationId;
  }

}
