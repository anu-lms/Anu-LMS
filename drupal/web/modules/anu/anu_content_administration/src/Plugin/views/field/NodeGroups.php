<?php

namespace Drupal\anu_content_administration\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Utility\Html;
use Drupal\views\ResultRow;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Field handler to show list of node groups.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("anu_node_groups")
 */
class NodeGroups extends FieldPluginBase {

  /**
   * @{inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * @{inheritdoc}
   */
  public function render(ResultRow $values) {
    $entity = $values->_entity;

    $connection = \Drupal::database();
    $query = $connection->select('group_content_field_data', 'content');
    $query->innerJoin('groups_field_data', 'data', 'data.id = content.gid');
    $query->fields('data', ['id', 'label']);
    $query->condition('content.entity_id', $entity->id());
    $query->condition('content.type', 'class-group_node%', 'LIKE');

    $results = $query->execute();

    $groups = [];
    foreach ($results as $group) {
      $edit_link = Link::fromTextAndUrl(
        $this->t('[edit]'),
        Url::fromUri('internal:/group/' . $group->id . '/edit', ['query' => \Drupal::destination()->getAsArray()])
      );

      $groups[] = ['#markup' => Html::escape($group->label) . ' ' . $edit_link->toString()];
    }

    if (count($groups) > 1) {
      return [
        '#theme' => 'item_list',
        '#items' => $groups,
        '#title' => NULL,
      ];
    }

    return $groups;
  }

}
