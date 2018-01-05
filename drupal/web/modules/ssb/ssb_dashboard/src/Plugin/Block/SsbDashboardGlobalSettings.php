<?php

namespace Drupal\ssb_dashboard\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\ssb_dashboard\DashboardClass;

/**
 * Provides a 'SsbDashboardGlobalSettings' block.
 *
 * @Block(
 *  id = "ssb_dashboard_global_settings",
 *  admin_label = @Translation("Global settings"),
 * )
 */
class SsbDashboardGlobalSettings extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $bundles = [
      'global_settings',
      'settings_email_notification',
      'analytics',
    ];
    $class = new DashboardClass();

    $pages = $class->getRouteConfigPages($bundles);

    $build = [];

    $build['#pages'] = $pages;
    $build['#theme'] = 'dashboard_global_settings';

    return $build;
  }

}
