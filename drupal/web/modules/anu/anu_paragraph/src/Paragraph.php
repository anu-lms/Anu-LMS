<?php

namespace Drupal\anu_paragraph;

use Drupal\user\Entity\User;

class Paragraph {

  public function getCommentsAmount($paragraph_id) {
    $account = User::load(\Drupal::currentUser()->id());
    $organization_ids = array_column($account->field_organization->getValue(), 'target_id');

    $connection = \Drupal::database();
    $query = $connection->select('paragraph_comment', 'comments');
    $query->leftJoin('paragraph_comment__field_comment_deleted', 'deleted', 'comments.id = deleted.entity_id');
    $query->leftJoin('paragraph_comment__field_comment_organization', 'organization', 'comments.id = organization.entity_id');
    $query->leftJoin('paragraph_comment__field_comment_paragraph', 'paragraph', 'comments.id = paragraph.entity_id');

    $query->addField('organization', 'field_comment_organization_target_id', 'organization');

    $query->addExpression('count(id)', 'amount');
    $query->condition('paragraph.field_comment_paragraph_value', $paragraph_id);
    $query->condition('deleted.field_comment_deleted_value', 0);
    $query->condition('organization.field_comment_organization_target_id', $organization_ids, 'IN');

    $query->groupBy("organization.field_comment_organization_target_id");

    $results = $query->execute()->fetchAllKeyed();

    return $results;
  }

}
