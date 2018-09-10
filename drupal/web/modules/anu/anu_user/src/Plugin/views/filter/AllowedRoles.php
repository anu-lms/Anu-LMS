<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\user\Plugin\views\filter\Roles;
use Drupal\Core\Database\Query\Condition;

/**
 * Filter handler for user roles.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("user_allowed_roles")
 */
class AllowedRoles extends Roles {

  /**
   * {@inheritdoc}
   *
   * Replace the configured permission with a filter by all roles that have this
   * permission.
   */
  public function query() {
//    $allowed_roles = \Drupal::service('delegatable_roles')->getAssignableRoles(\Drupal::currentUser());
//    $this->value = [];
//    foreach (array_keys($allowed_roles) as $rid) {
//      $this->value[$rid] = $rid;
//    }
//
//    parent::query();



    $allowed_roles = \Drupal::service('delegatable_roles')->getAssignableRoles(\Drupal::currentUser());

    $join = $this->getJoin();
    $join->type = 'LEFT';
    $this->query->addTable('user__roles', NULL, $join);

    $field = $this->table . '.' . $this->realField . ' ';
    $or = new Condition('OR');
    if (!empty($allowed_roles)) {
      $or->condition($field, array_keys($allowed_roles), 'IN');
    }
    $or->isNull($field);

    $this->query->addWhere($this->options['group'], $or);
  }

}
