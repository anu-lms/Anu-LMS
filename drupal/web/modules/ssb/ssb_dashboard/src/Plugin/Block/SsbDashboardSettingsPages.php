<?php

namespace Drupal\ssb_dashboard\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\ssb_dashboard\DashboardClass;

/**
 * Provides a 'SsbDashboardSettingsPages' block.
 *
 * @Block(
 *  id = "ssb_dashboard_settings_pages",
 *  admin_label = @Translation("Pages settings"),
 * )
 */
class SsbDashboardSettingsPages extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $class = new DashboardClass();
    $exclude_bundles = [
      'site_menu',
      'global_settings',
      'settings_email_notification',
      'analytics'
    ];

    $pages = $class->getRouteConfigPages([], $exclude_bundles);

    if (empty($pages)) {
      return [];
    }

    $build = [];
    $build['#pages'] = $pages;
    $build['#theme'] = 'dashboard_settings_pages';
    return $build;
  }

}
