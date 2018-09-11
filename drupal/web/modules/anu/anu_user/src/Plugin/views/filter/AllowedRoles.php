<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\views\ViewExecutable;
use Drupal\Core\Database\Query\Condition;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\Plugin\views\display\DisplayPluginBase;

/**
 * Filter handler for user roles.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("user_allowed_roles")
 */
class AllowedRoles extends InOperator {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->definition['options callback'] = [$this, 'generateOptions'];
  }

  /**
   * {@inheritdoc}
   */
  public function canExpose() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function operators() {
    $operators = [
      'in' => [
        'title' => $this->t('Is one of'),
        'short' => $this->t('in'),
        'short_single' => $this->t('='),
        'method' => 'opSimple',
        'values' => 1,
      ],
    ];

    return $operators;
  }

  /**
   * {@inheritdoc}
   */
  public function query() {
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

  /**
   * Generate list of options for filter.
   */
  public function generateOptions() {
    return [
      'allowed_roles' => $this->t('Allowed roles for current user')
    ];
  }

}
