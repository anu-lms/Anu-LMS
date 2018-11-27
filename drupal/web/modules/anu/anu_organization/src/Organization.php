<?php

namespace Drupal\anu_organization;

use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\Core\Site\Settings;
use Drupal\Component\Utility\UrlHelper;

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
   * Generates onboarding link from given organization object.
   *
   * For current needs we generate onboarding link only based on organization uuid.
   * In future we might need to include multiple organizations and classes to that link.
   * We can include data in url and encrypt it for example:
   * organization=6+9997&classes=12+34+54 => encrypt to => asd324fsasd235cssa23fasd3
   */
  public function getOnboardingLink($organization) {
    // Prepares onboarding url.
    $link = Url::fromUri(
      Settings::get('frontend_domain') . 'user/register',
      ['query' => ['token' => $organization->uuid()]]
    );
    return $link->toString();
  }

  /**
   * Returns organization object fetched from onboarding link.
   *
   * For current needs we includes organization uuid only to the onboarding link.
   * In future we might need to get more information from that link.
   */
  public function getOrganizationFromOnboardingLink($link) {
    $organization = NULL;

    $url_parsed = UrlHelper::parse($link);
    if (!empty($url_parsed['query']['token'])) {
      $organization = \Drupal::service('entity.repository')->loadEntityByUuid('taxonomy_term', $url_parsed['query']['token']);
    }

    return $organization;
  }

}
