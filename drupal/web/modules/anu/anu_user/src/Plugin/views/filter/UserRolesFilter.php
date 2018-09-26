<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\Core\Database\Query\Condition;
use Drupal\views\ViewExecutable;

/**
 * Filters content by groups they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_user_roles")
 */
class UserRolesFilter extends InOperator {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('User roles filter');
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
    $current_user = \Drupal::currentUser();
    // Get allowed roles for the current user.
    $allowed_roles = \Drupal::service('delegatable_roles')->getAssignableRoles($current_user);

    // Join User roles table.
    $join = $this->getJoin();
    $join->type = 'LEFT';
    $this->query->addTable('user__roles', NULL, $join);

    $field = $this->table . '.' . $this->realField . ' ';
    $or = new Condition('OR');

    // Show only users with allowed roles
    if (!empty($allowed_roles)) {
      $values = $this->options['exposed'] ? $this->value : array_keys($allowed_roles);
      $or->condition($field, $values, 'IN');
    }

    // Or authenticated users.
    $or->isNull($field);

    // Or current user.
    $or->condition('users_field_data.uid', $current_user->id());

    $this->query->addWhere($this->options['group'], $or);
  }

  /**
   * Generate list of groups for filter.
   */
  public function generateOptions() {
    return \Drupal::service('delegatable_roles')->getAssignableRoles(\Drupal::currentUser());
  }

}
