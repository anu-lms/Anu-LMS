<?php

/**
 * Implements hook_views_data_alter().
 */
function anu_content_administration_views_data_alter(array &$data) {

  // Custom field to display user groups (classes).
  $data['node']['node_groups'] = [
    'title' => t('Node groups'),
    'field' => [
      'title' => t('Node groups'),
      'help' => t('List of node groups.'),
      'id' => 'anu_node_groups',
    ],
    'filter' => [
      'title' => t('Group filter'),
      'help' => 'Filters users by groups they belong to',
      'field' => 'nid',
      'id' => 'anu_node_groups_filter',
    ],
  ];
  $data['node']['course_lessons'] = [
    'title' => t('Course lessons'),
    'filter' => [
      'title' => t('Course lessons filter'),
      'help' => 'Filters users by groups they belong to',
      'field' => 'nid',
      'id' => 'anu_course_lessons_filter',
    ],
  ];

}
