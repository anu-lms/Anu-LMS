<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\views\Views;
use Drupal\user\Entity\User;
use Drupal\views\ViewExecutable;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\Plugin\views\display\DisplayPluginBase;

/**
 * Filter handler for user roles.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_assigned_organizations")
 */
class UserOrganization extends InOperator {

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

    $current_user = \Drupal::currentUser();
    if ($current_user->hasPermission('manage any organization')) {
      return;
    }

    $account = User::load($current_user->id());

    $account_organization_ids = [];
    // Get organization ids from current user.
    if (!empty($account->field_organization->getValue())) {
      $account_organization_ids = array_column($account->field_organization->getValue(), 'target_id');
    }

    if (empty($account_organization_ids)) {
      return;
    }

    // Join Group's table.
    $configuration = [
      'table' => 'user__field_organization',
      'field' => 'entity_id',
      'left_table' => 'users_field_data',
      'left_field' => 'uid',
      'type' => 'INNER',
      'operator' => '=',
      'extra' => 'user__field_organization.deleted = \'0\'',
    ];

    $join = Views::pluginManager('join')
      ->createInstance('standard', $configuration);

    // Filter by users in groups.
    $this->query->addRelationship('user__field_organization', $join, 'users');

    $this->query->addWhere('AND', 'user__field_organization.field_organization_target_id', $account_organization_ids, 'IN');
  }

  /**
   * Generate list of options for filter.
   */
  public function generateOptions() {
    return [
      'assigned_organizations' => $this->t('Assigned organizations')
    ];
  }

}
