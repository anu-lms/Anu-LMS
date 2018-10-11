<?php

namespace Drupal\anu_organization\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\ViewExecutable;

/**
 * Filters content by organizations they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_allowed_organization")
 */
class AllowedOrganizationFilter extends OrganizationFilterBase {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Allowed organization filter');
  }

  /**
   * {@inheritdoc}
   */
  public function query() {
    // If filter used as exposed, use chosen value as param.
    if ($this->options['exposed']) {

      // Filter groups by chosen organization.
      $this->query->addWhere('AND', 'taxonomy_term_field_data.tid', $this->value, 'IN');
    }
    // If filter simply added to the views, filter views results by organizations of current user.
    else {
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
      $this->query->addWhere('AND', 'taxonomy_term_field_data.tid', $account_organization_ids, 'IN');
    }
  }

}
