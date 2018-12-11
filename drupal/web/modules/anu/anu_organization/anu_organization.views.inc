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
  $data['taxonomy_term_field_data']['onboarding_link'] = [
    'title' => t('Onboarding link'),
    'field' => [
      'title' => t('Onboarding link'),
      'field' => 'tid',
      'id' => 'anu_onboarding_link',
    ],
  ];
  $data['taxonomy_term_field_data']['limit_info'] = [
    'title' => t('Limit info'),
    'field' => [
      'title' => t('Limit info'),
      'description' => t('Information about registered users and limit for organization'),
      'field' => 'tid',
      'id' => 'anu_limit_info',
    ],
  ];
}
