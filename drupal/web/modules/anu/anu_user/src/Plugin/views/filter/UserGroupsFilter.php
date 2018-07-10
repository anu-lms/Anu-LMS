<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\ViewExecutable;
use Drupal\views\Views;

/**
 * Filters users by groups they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_user_groups_filter")
 */
class UserGroupsFilter extends InOperator {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Group filter');
    $this->definition['options callback'] = [$this, 'generateOptions'];
  }

  /**
   * {@inheritdoc}
   */
  public function validate() {
    if (!empty($this->value)) {
      parent::validate();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function query() {

    // Join Group's table.
    $configuration = [
      'table' => 'group_content_field_data',
      'field' => 'entity_id',
      'left_table' => 'users_field_data',
      'left_field' => 'uid',
      'type' => 'INNER',
      'operator' => '=',
      'extra' => 'group_content_field_data.type = \'class-group_membership\'',
    ];

    $join = Views::pluginManager('join')
      ->createInstance('standard', $configuration);

    // Filter by users in groups.
    $this->query->addRelationship('group_content_field_data', $join, 'users');
    $this->query->addWhere('AND', 'group_content_field_data.gid', $this->value, 'IN');
  }

  /**
   * Generate list of groups for filter.
   */
  public function generateOptions() {
    $group_list = [];

    try {

      // Load all available groups.
      $groups = \Drupal::entityTypeManager()
        ->getStorage('group')
        ->loadMultiple();

      // Convert them into an array for forms api.
      foreach ($groups as $group) {
        if ($group->access('view')) {
          $group_list[$group->id()] = $group->label();
        }
      }

      // Sort alphabetically by group label.
      asort($group_list);

    }
    catch (\Exception $exception) {
      \Drupal::logger('anu_user')->critical('Could not load list of groups for filter.');
    }

    return $group_list;
  }

}
