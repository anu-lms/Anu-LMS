<?php

namespace Drupal\ssb_dashboard\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\ssb_dashboard\DashboardClass;

/**
 * Provides a 'SsbDashboardEdit' block.
 *
 * @Block(
 *  id = "ssb_dashboard_edit",
 *  admin_label = @Translation("Content Edit"),
 * )
 */
class SsbDashboardEdit extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $class = new DashboardClass();

    $categories = $class->getRouteTaxanomy();

    $pages = $class->getRouteConfigPages(['site_menu']);
    $build = [];

    $build['#pages'] = $pages;
    $build['#categories'] = $categories;
    $build['#theme'] = 'dashboard_edit';
    return $build;
  }

}
