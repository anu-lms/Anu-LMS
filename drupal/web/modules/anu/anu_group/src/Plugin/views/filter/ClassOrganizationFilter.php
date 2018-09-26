<?php

namespace Drupal\anu_group\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\ViewExecutable;
use Drupal\user\Entity\User;
use Drupal\views\Views;

/**
 * Filters content by groups they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_class_organization")
 */
class ClassOrganizationFilter extends InOperator {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Class organization filter');
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
    $join_configuration = [
      'table' => 'group__field_organization',
      'field' => 'entity_id',
      'left_table' => 'groups_field_data',
      'left_field' => 'id',
      'type' => 'INNER',
      'operator' => '=',
    ];

    $join = Views::pluginManager('join')
      ->createInstance('standard', $join_configuration);


    if ($this->options['exposed']) {

      // Filter by nodes in groups.
      $this->query->addRelationship('group__field_organization', $join, 'groups');
      $this->query->addWhere('AND', 'group__field_organization.field_organization_target_id', $this->value, 'IN');
    }
    else {

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

      // Don't apply filter if user has no organizations (every user should have organization).
      if (empty($account_organization_ids)) {
        return;
      }

      // Filter by nodes in groups.
      $this->query->addRelationship('group__field_organization', $join, 'groups');
      $this->query->addWhere('AND', 'group__field_organization.field_organization_target_id', $account_organization_ids, 'IN');
    }
  }

  /**
   * Generate list of groups for filter.
   */
  public function generateOptions() {
    $organization_list = [];

    // Only users with special permissions should edit organizations on Add user page.
    if (\Drupal::currentUser()->hasPermission('manage any organization')) {
      $organizations = \Drupal::entityTypeManager()
        ->getStorage('taxonomy_term')
        ->loadByProperties([
          'vid' => 'organisations',
        ]);

      foreach ($organizations as $organization) {
        $organization_list[$organization->id()] = $organization->label();
      }

      // Sort alphabetically by group label.
      asort($organization_list);
    }
    else {
      $current_user = \Drupal::currentUser();
      $account = User::load($current_user->id());

      // Get organization ids from current user.
      if (!empty($account->field_organization->getValue())) {
        $organizations = $account->field_organization->referencedEntities();
        foreach ($organizations as $organization) {
          $organization_list[(int) $organization->id()] = $organization->getName();
        }
      }
    }

    return $organization_list;
  }

}
