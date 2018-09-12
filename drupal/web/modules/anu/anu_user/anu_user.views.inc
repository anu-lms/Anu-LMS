<?php

/**
 * @file
 * Provide views data for anu_user.module.
 */

/**
 * Implements hook_views_data_alter().
 */
function anu_user_views_data_alter(array &$data) {

  // Custom field to display user groups (classes).
  $data['users']['user_groups'] = [
    'title' => t('User groups'),
    'field' => [
      'title' => t('User groups'),
      'help' => t('List of user groups.'),
      'id' => 'anu_user_groups',
    ],
    'filter' => [
      'title' => t('Group filter'),
      'help' => 'Filters users by groups they belong to',
      'field' => 'uid',
      'id' => 'anu_user_groups_filter',
    ],
  ];

  // Custom filter to filter views by assigned to current user organization.
  $data['users']['assigned_organizations'] = [
    'title' => t('Assigned organizations'),
    'filter' => [
      'title' => t('Assigned organizations'),
      'help' => 'Filters users by assigned to current user organization',
      'field' => 'uid',
      'id' => 'anu_assigned_organizations',
    ],
  ];

  // Custom filter to show users with allowed roles only.
  $data['user__roles']['user_allowed_roles'] = [
    'title' => t('Allowed roles'),
    'filter' => [
      'title' => t('Allowed roles'),
      'help' => 'Filters users by allowed roles',
      'field' => 'roles_target_id',
      'id' => 'user_allowed_roles',
    ],
  ];
}
