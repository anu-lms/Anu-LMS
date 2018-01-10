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

    $entities = [];
    $entityTypeManager = \Drupal::entityTypeManager();

    $node_types = $entityTypeManager->getStorage('node_type')->loadMultiple();
    foreach ($node_types as $entity) {
      if ($entity->access('create')) {
        $entities[] = [
          'url' => \Drupal\Core\Url::fromRoute('node.add', ['node_type' => $entity->id()])->toString(),
          'name' => $entity->get('name'),
          'description' => $entity->get('description'),
        ];
      }
    }

    $class_types = $entityTypeManager->getStorage('group_type')->loadMultiple();
    foreach ($class_types as $entity) {
      if ($entityTypeManager->getAccessControlHandler('group')->createAccess($entity->id())) {
        $entities[] = [
          'url' => \Drupal\Core\Url::fromRoute('entity.group.add_form', ['group_type' => $entity->id()]),
          'name' => $entity->label(),
          'description' => $entity->get('description'),
        ];
      }
    }

    if (empty($entities)) {
      return [];
    }

    return [
      '#theme' => 'dashboard_add',
      '#nodes' => $entities,
    ];
  }

}
