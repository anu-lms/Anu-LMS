<?php

namespace Drupal\anu_user\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Utility\Html;
use Drupal\views\ResultRow;

/**
 * Field handler to show list of user groups.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("anu_user_groups")
 */
class UserGroups extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $account = $values->_entity;

    $groups_list = [];
    $group_memberships = \Drupal::service('group.membership_loader')->loadByUser($account);
    foreach ($group_memberships as $group_membership) {
      $group = $group_membership->getGroup();
      if ($group->access('view')) {
        $groups_list[$group->id()] = Html::escape($group->label());
      }
    }

    return ['#markup' => implode(', ', $groups_list)];
  }

}
