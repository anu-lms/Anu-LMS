<?php

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

}
