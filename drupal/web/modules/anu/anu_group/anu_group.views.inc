<?php

/**
 * @file
 * Provide views data for anu_group.module.
 */

/**
 * Implements hook_views_data_alter().
 */
function anu_group_views_data_alter(array &$data) {
  $data['groups']['class_organization'] = [
    'title' => t('Class organization'),
    'filter' => [
      'title' => t('Class organization'),
      'field' => 'id',
      'id' => 'anu_class_organization',
    ],
  ];

}
