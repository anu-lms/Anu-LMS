<?php

namespace Drupal\anu_user;

use Drupal\user\Entity\User as EntityUser;

/**
 * Helper class for working with users.
 *
 * @package Drupal\anu_group
 */
class User {

  /**
   * Returns organization ids of given or current user.
   */
  public function getOrganizationIds($account = NULL) {
    // Get organization ids from the current user if param wasn't passed.
    if (!$account) {
      $account = \Drupal::currentUser();
    }
    $account_entity = EntityUser::load($account->id());

    $account_organization_ids = [];
    // Get organization ids from the user.
    if (!empty($account_entity->field_organization->getValue())) {
      $account_organization_ids = array_column($account_entity->field_organization->getValue(), 'target_id');
    }

    return $account_organization_ids;
  }

  /**
   * Returns list of allowed organizations for given user.
   */
  public function getAllowedOrganizationsList($account = NULL) {
    $organization_list = [];

    // Get organization ids from the current user if param wasn't passed.
    if (!$account) {
      $account = \Drupal::currentUser();
    }
    $account_entity = EntityUser::load($account->id());

    // Load all organizations if user can manage any organization.
    if ($account_entity->hasPermission('manage any organization')) {
      $organizations = \Drupal::entityTypeManager()
        ->getStorage('taxonomy_term')
        ->loadByProperties([
          'vid' => 'organisations',
        ]);

      foreach ($organizations as $organization) {
        $organization_list[$organization->id()] = $organization->label();
      }

      // Sort alphabetically by group label.
      asort($organization_list);
    }
    else {
      // Get organizations from current user.
      if (!empty($account_entity->field_organization->getValue())) {
        $organizations = $account_entity->field_organization->referencedEntities();
        foreach ($organizations as $organization) {
          $organization_list[(int) $organization->id()] = $organization->getName();
        }
      }
    }

    // Return list of available organizations for current user.
    return $organization_list;
  }

}
