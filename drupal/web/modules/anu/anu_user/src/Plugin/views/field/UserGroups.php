<?php

/**
 * @file
 *
 */

namespace Drupal\anu_user\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Utility\Html;
use Drupal\views\ResultRow;

/**
 * Field handler to show list of user groups.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("anu_user_groups")
 */
class UserGroups extends FieldPluginBase {

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
    $account = $values->_entity;

    $connection = \Drupal::database();
    $query = $connection->select('group_content_field_data', 'content');
    $query->innerJoin('groups_field_data', 'data', 'data.id = content.gid');
    $query->fields('data', ['label']);
    $query->condition('content.entity_id', $account->id());
    $query->condition('content.type', 'class-group_membership');

    $results = $query->execute();

    $groups = [];
    foreach ($results as $group) {
      $groups[] = Html::escape($group->label);
    }

    return implode(', ', $groups);
  }
}
