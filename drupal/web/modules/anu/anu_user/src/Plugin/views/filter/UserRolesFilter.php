<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\Core\Database\Query\Condition;
use Drupal\views\ViewExecutable;

/**
 * Filters users by roles.
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

    if ($this->options['exposed']) {
      $this->query->addWhere($this->options['group'], $field, $this->value, 'IN');
    }
    else {
      // Skip filtration If it's normal filter and user can manage users with any role.
      if ($current_user->hasPermission('manage users with any role')) {
        return;
      }
      $or = new Condition('OR');

      if (!empty($allowed_roles)) {
        $or->condition($field, array_keys($allowed_roles), 'NOT IN');
      }

      // Or authenticated users.
      $or->isNull($field);

      // Or current user.
      $or->condition('users_field_data.uid', $current_user->id());

      $this->query->addWhere($this->options['group'], $or);
    }
  }

  /**
   * Generate list of roles for filter.
   */
  public function generateOptions() {
    return user_role_names(TRUE, 'access backend');
  }

}
