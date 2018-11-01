<?php

namespace Drupal\anu_user\Plugin\views\filter;

use Drupal\anu_organization\Plugin\views\filter\OrganizationFilterBase;
use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\ViewExecutable;
use Drupal\views\Views;

/**
 * Filters users by organizations they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_user_organization")
 */
class UserOrganizationFilter extends OrganizationFilterBase {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('User organization filter');
  }

  /**
   * {@inheritdoc}
   */
  public function query() {

    // Join Organization's table.
    $join_configuration = [
      'table' => 'user__field_organization',
      'field' => 'entity_id',
      'left_table' => 'users_field_data',
      'left_field' => 'uid',
      'type' => 'INNER',
      'operator' => '=',
      'extra' => 'user__field_organization.deleted = \'0\'',
    ];

    $join = Views::pluginManager('join')
      ->createInstance('standard', $join_configuration);

    // If filter used as exposed, use choosen value as param.
    if ($this->options['exposed']) {

      // Filter users by chosen organization.
      $this->query->addRelationship('user__field_organization', $join, 'users');
      $this->query->addWhere('AND', 'user__field_organization.field_organization_target_id', $this->value, 'IN');
    }
    // If filter simply added to the views, filter views results by organizations of current user.
    else {
      if (\Drupal::currentUser()->hasPermission('manage any organization')) {
        return;
      }

      $account_organization_ids = \Drupal::service('anu_user.user')->getOrganizationIds();
      // Don't apply filter if user has no organizations (every user should have organization).
      if (empty($account_organization_ids)) {
        return;
      }

      // Filter users by organizations of current user.
      $this->query->addRelationship('user__field_organization', $join, 'users');
      $this->query->addWhere('AND', 'user__field_organization.field_organization_target_id', $account_organization_ids, 'IN');
    }
  }

}
