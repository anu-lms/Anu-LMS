<?php

namespace Drupal\anu_events\Event;

class AddCommentToThreadEvent extends AnuEvent {

  public function __construct($entity, $template_name = '') {
    parent::__construct($entity, AnuEvents::ADD_COMMENT_TO_THREAD, 'add_comment_to_thread');
    $this->recipient = (int) $this->entity->field_comment_parent
      ->first()
      ->get('entity')
      ->getValue()
      ->uid
      ->target_id;
  }

  public function attachMessageFields($message) {
    $comment = $this->getEntity();
    $message->field_message_comment = $comment->id();
    $message->field_message_recipient = $this->getRecipient();
  }

  private function findRootComment() {
    $comment = $this->getEntity();

    // Load all comments from the paragraph and organization.
    $query = \Drupal::entityQuery('paragraph_comment');
    $query->condition('type', 'paragraph_comment');

    $value = $comment->field_comment_paragraph->getValue();
    $query->condition('field_comment_paragraph', $value[0]['value']);

    $value = $comment->field_comment_organization->getValue();
    if (!empty($value[0]['target_id'])) {
      $query->condition('field_comment_organization', $value[0]['target_id']);
    }
    else {
      $query->notExists('field_comment_organization');
    }

    $entity_ids = $query->execute();
    $comments = \Drupal::entityTypeManager()
      ->getStorage('paragraph_comment')
      ->loadMultiple($entity_ids);

    if (!empty($comment->field_comment_parent->getValue())) {
      $parent_id = $comment->field_comment_parent->getString();

      $current_comment = $comments[$parent_id];
      if (!empty($current_comment->field_comment_parent->getValue())) {
        $parent_id = $current_comment->field_comment_parent->getString();
      }
      else {
        return $current_comment->id();
      }
    }
  }

}
