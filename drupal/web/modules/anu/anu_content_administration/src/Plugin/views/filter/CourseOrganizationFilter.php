<?php

namespace Drupal\anu_content_administration\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\ViewExecutable;
use Drupal\user\Entity\User;
use Drupal\views\Views;

/**
 * Filters courses by organization they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_course_organization")
 */
class CourseOrganizationFilter extends InOperator {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Course organization filter');
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

    if ($this->options['exposed']) {

      // Filter by organization in course.
      $this->query->addRelationship('node__field_course_organisation', $join, 'node');
      $this->query->addWhere('AND', 'node__field_course_organisation.field_course_organisation_target_id', $this->value, 'IN');
    }
    else {

      // Don't apply filter if user has 'manage any organization' permissions.
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

      // Filter by organization in course.
      $this->query->addRelationship('node__field_course_organisation', $join, 'node');
      $this->query->addWhere('AND', 'node__field_course_organisation.field_course_organisation_target_id', $account_organization_ids, 'IN');
    }
  }

  /**
   * Generate list of available organizations for filter.
   */
  public function generateOptions() {
    $organization_list = [];

    // Load all list if user can manage any organization.
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
      // Load only available for user organizations.
      $current_user = \Drupal::currentUser();
      $account = User::load($current_user->id());

      // Get organizations from current user.
      if (!empty($account->field_organization->getValue())) {
        $organizations = $account->field_organization->referencedEntities();
        foreach ($organizations as $organization) {
          $organization_list[(int) $organization->id()] = $organization->getName();
        }
      }
    }

    // Return list of available organizations for current user.
    return $organization_list;
  }

}
