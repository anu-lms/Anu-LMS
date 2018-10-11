<?php

namespace Drupal\anu_content_administration\Plugin\views\filter;

use Drupal\anu_organization\Plugin\views\filter\OrganizationFilterBase;
use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\ViewExecutable;
use Drupal\views\Views;

/**
 * Filters courses by organization they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_course_organization")
 */
class CourseOrganizationFilter extends OrganizationFilterBase {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Course organization filter');
  }

  /**
   * {@inheritdoc}
   */
  public function query() {

    // Join Course organization table.
    $join_configuration = [
      'table' => 'node__field_course_organisation',
      'field' => 'entity_id',
      'left_table' => 'node_field_data',
      'left_field' => 'nid',
      'type' => 'INNER',
      'operator' => '=',
    ];

    $join = Views::pluginManager('join')
      ->createInstance('standard', $join_configuration);

    // If filter used as exposed, use chosen value as param.
    if ($this->options['exposed']) {

      // Filter courses by chosen organization.
      $this->query->addRelationship('node__field_course_organisation', $join, 'node');
      $this->query->addWhere('AND', 'node__field_course_organisation.field_course_organisation_target_id', $this->value, 'IN');
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

      // Filter courses by allowed for current user organizations.
      $this->query->addRelationship('node__field_course_organisation', $join, 'node');
      $this->query->addWhere('AND', 'node__field_course_organisation.field_course_organisation_target_id', $account_organization_ids, 'IN');
    }
  }

}
