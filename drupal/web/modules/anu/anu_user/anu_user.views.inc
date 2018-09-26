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
  $data['users']['user_organization'] = [
    'title' => t('User organization'),
    'filter' => [
      'title' => t('User organization'),
      'help' => 'Filters users by assigned to current user organization',
      'field' => 'uid',
      'id' => 'anu_user_organization',
    ],
  ];

  // Custom filter to show users with allowed roles only.
  $data['user__roles']['user_roles'] = [
    'title' => t('User roles'),
    'filter' => [
      'title' => t('User roles'),
      'help' => 'Filters users by allowed roles',
      'field' => 'roles_target_id',
      'id' => 'anu_user_roles',
    ],
  ];
}
