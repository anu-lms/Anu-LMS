<?php

/**
 * Implements hook_views_data_alter().
 */
function anu_user_views_data_alter(array &$data) {
  $data['users']['user_groups'] = array(
    'title' => t('User groups'),
    'field' => array(
      'title' => t('User groups'),
      'help' => t('List of user groups.'),
      'id' => 'anu_user_groups',
    ),
  );
}
