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

    $groups = [];
    $group_entities = \Drupal::entityTypeManager()->getStorage('group')->loadMultiple();
    foreach ($group_entities as $group) {
      if ($group->access('update')) {
        $groups[] = [
          'url' => \Drupal\Core\Url::fromRoute('entity.group.edit_form', ['group' => $group->id()]),
          'name' => t('Edit %group', ['%group' => $group->label()]),
          'description' => t('Change content of @group.', ['@group' => $group->bundle()]),
        ];
      }
    }

    $build['#pages'] = $pages;
    $build['#categories'] = $categories;
    $build['#groups'] = $groups;
    $build['#theme'] = 'dashboard_edit';
    return $build;
  }

}
