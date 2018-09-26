<?php

/**
 * @file
 * Provide views data for anu_organization.module.
 */

/**
 * Implements hook_views_data_alter().
 */
function anu_organization_views_data_alter(array &$data) {

  $data['taxonomy_term_field_data']['allowed_organization'] = [
    'title' => t('Allowed organization'),
    'filter' => [
      'title' => t('Allowed organization'),
      'field' => 'tid',
      'id' => 'anu_allowed_organization',
    ],
  ];

}
