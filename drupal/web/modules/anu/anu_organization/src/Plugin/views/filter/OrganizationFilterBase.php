<?php

namespace Drupal\anu_organization\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\ViewExecutable;

/**
 * Base class for organization filter.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_organization_filter_base")
 */
class OrganizationFilterBase extends InOperator {

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
  public function validate() {
    if (!empty($this->value)) {
      parent::validate();
    }
  }

  /**
   * Generate list of available organizations for current user.
   */
  public function generateOptions() {
    return \Drupal::service('anu_user.user')->getAllowedOrganizationsList();
  }
}
