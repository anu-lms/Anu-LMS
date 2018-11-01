<?php

namespace Drupal\anu_content_administration\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\group\Entity\GroupContent;
use Drupal\views\ViewExecutable;
use Drupal\user\Entity\User;
use Drupal\views\Views;

/**
 * Filters content by groups they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_node_groups_filter")
 */
class NodeGroupsFilter extends InOperator {

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
      'left_table' => 'node_field_data',
      'left_field' => 'nid',
      'type' => 'LEFT',
      'operator' => '=',
      'extra' => 'group_content_field_data.type LIKE \'class-group_node%\'',
    ];

    $join = Views::pluginManager('join')
      ->createInstance('standard', $configuration);

    // If filter used as exposed, use chosen value as param.
    if ($this->options['exposed']) {

      // Filter nodes by chosen group.
      $this->query->addRelationship('group_content_field_data', $join, 'node');
      $this->query->addWhere('AND', 'group_content_field_data.gid', $this->value, 'IN');
    }
    // If filter simply added to the views, filter views results by groups of current user.
    else {
      // Don't apply filter if user has 'administer nodes' permissions.
      if (\Drupal::currentUser()->hasPermission('administer nodes')) {
        return;
      }

      // Load a user object for the current user.
      $user = User::load(\Drupal::currentUser()->id());

      // Load all group membership entities where the current user is a member.
      $group_contents = GroupContent::loadByEntity($user);

      $user_group_ids = [];
      /* @var $group_content \Drupal\group\Entity\GroupContent */
      foreach ($group_contents as $group_content) {

        /* @var $group \Drupal\group\Entity\Group */
        $user_group_ids[] = $group_content->getGroup()->id();
      }

      if (empty($user_group_ids)) {
        return;
      }

      $gids = implode(', ', $user_group_ids);
      $author_id = $user->id();
      // Only course author or user within a group can see course.
      $this->query->addRelationship('group_content_field_data', $join, 'node');
      $this->query->addWhereExpression('AND', "group_content_field_data.gid IN ($gids) OR node_field_data.uid = $author_id");
    }
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
      \Drupal::logger('anu_content_administration')->critical('Could not load list of groups for filter.');
    }

    return $group_list;
  }

}
