<?php

namespace Drupal\ssb_dashboard\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'DefaultBlock' block.
 *
 * @Block(
 *  id = "ssb_dashboard_add",
 *  admin_label = @Translation("Content add"),
 * )
 */
class SsbDashboardAdd extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $node_types = \Drupal::entityTypeManager()->getStorage('node_type')->loadMultiple();
    $nodes = [];

    foreach ($node_types as $entity) {
      $nodes[] = [
        'type' => ['node_type' => $entity->getOriginalId()],
        'name' => $entity->get('name'),
        'description' => $entity->get('description'),
      ];
    }

    $build = [];
    $build['#theme'] = 'dashboard_add';
    $build['#nodes'] = $nodes;

    return $build;
  }

}
