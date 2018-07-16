<?php

namespace Drupal\anu_paragraph;

use Drupal\user\Entity\User;

/**
 * Helper for paragraph entity.
 */
class Paragraph {

  /**
   * Returns an array with data about comments amount separated by organization.
   *
   * @param int $paragraph_id
   *   An id of paragraph entity.
   *
   * @return array
   *   An array with data about comments amount separated by organization. [$org_id => $comments_amount].
   *   Use `0` as a key if comment not assigned to any organization.
   */
  public function getCommentsAmount($paragraph_id) {
    $no_organization_id = 0;
    $account = User::load(\Drupal::currentUser()->id());
    $organization_ids = array_column($account->field_organization->getValue(), 'target_id');

    // Prepares query to fetch comments amount.
    $connection = \Drupal::database();
    $query = $connection->select('paragraph_comment', 'comments');
    $query->leftJoin('paragraph_comment__field_comment_deleted', 'deleted', 'comments.id = deleted.entity_id');
    $query->leftJoin('paragraph_comment__field_comment_organization', 'organization', 'comments.id = organization.entity_id');
    $query->leftJoin('paragraph_comment__field_comment_paragraph', 'paragraph', 'comments.id = paragraph.entity_id');

    $query->addField('organization', 'field_comment_organization_target_id', 'organization');

    // Filter by paragraph id.
    $query->condition('paragraph.field_comment_paragraph_value', $paragraph_id);

    // Exclude deleted comments from amount calculation.
    $query->condition('deleted.field_comment_deleted_value', 0);

    if (empty($organization_ids)) {
      // If user doesn't contain any organizations.
      $query->isNull('organization.field_comment_organization_target_id');

      // Fetch items count.
      $comments_amount = $query->countQuery()->execute()->fetchField();
      $results = [
        $no_organization_id => (int) $comments_amount,
      ];
    }
    else {
      $query->addExpression('count(id)', 'amount');
      $query->condition('organization.field_comment_organization_target_id', $organization_ids, 'IN');
      $query->groupBy('organization.field_comment_organization_target_id');

      // Returns an array of comments amounts grouped by organization.
      $query_results = $query->execute()->fetchAllKeyed();

      // Use an additional foreach to return amount as integer.
      $results = [];
      foreach ($query_results as $organization_id => $amount) {
        $results[$organization_id] = (int) $amount;
      }
    }

    return $results;
  }

}
