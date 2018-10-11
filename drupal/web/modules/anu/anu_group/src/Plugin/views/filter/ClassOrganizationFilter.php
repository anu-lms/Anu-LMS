<?php

namespace Drupal\anu_group\Plugin\views\filter;

use Drupal\anu_organization\Plugin\views\filter\OrganizationFilterBase;
use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\ViewExecutable;
use Drupal\views\Views;

/**
 * Filters classes by organization they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_class_organization")
 */
class ClassOrganizationFilter extends OrganizationFilterBase {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Class organization filter');
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

    // If filter used as exposed, use chosen value as param.
    if ($this->options['exposed']) {

      // Filter groups by given organization.
      $this->query->addRelationship('group__field_organization', $join, 'groups');
      $this->query->addWhere('AND', 'group__field_organization.field_organization_target_id', $this->value, 'IN');
    }
    // If filter simply added to the views, filter views results by organizations of current user.
    else {
      // Don't apply filter if user has 'manage any organization' permissions.
      $current_user = \Drupal::currentUser();
      if ($current_user->hasPermission('manage any organization')) {
        return;
      }

      $account_organization_ids = \Drupal::service('anu_user.user')->getOrganizationIds();
      // Don't apply filter if user has no organizations (every user should have organization).
      if (empty($account_organization_ids)) {
        return;
      }

      // Filter groups by organizations of current user.
      $this->query->addRelationship('group__field_organization', $join, 'groups');
      $this->query->addWhere('AND', 'group__field_organization.field_organization_target_id', $account_organization_ids, 'IN');
    }
  }

}
