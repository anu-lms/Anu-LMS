<?php

namespace Drupal\anu_group;

use Drupal\group\Entity\GroupContent;

/**
 * Helper class for working with groups.
 *
 * @package Drupal\anu_group
 */
class Group {

  /**
   * Loads ids of group by given entity.
   */
  public function getGroupIdsByEntity($entity) {
    if ($entity->isNew()) {
      return [];
    }

    $group_ids = [];
    $group_contents = GroupContent::loadByEntity($entity);
    foreach ($group_contents as $group_content) {
      $group_ids[] = $group_content->getGroup()->id();
    }

    return $group_ids;
  }

}
