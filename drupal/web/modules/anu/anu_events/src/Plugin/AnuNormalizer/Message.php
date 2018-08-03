<?php

namespace Drupal\anu_events\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for Message entity.
 *
 * @AnuNormalizer(
 *   id = "message_normalizer",
 *   title = @Translation("Message normalizer"),
 *   description = @Translation("Normalizes message entity"),
 * )
 */
class Message extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  public function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'message';
  }

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $include_fields) {
    $output = NULL;
    if (!$this->shouldApply($entity)) {
      return $output;
    }

    try {
      // Prepare common entity data.
      $output = [
        'id' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'bundle' => $entity->bundle(),
        'created' => (int) $entity->created->getString(),
        'triggerer' => AnuNormalizerBase::normalizeEntity($entity->uid->first()->get('entity')->getValue()),
        'isRead' => is_bool($entity->field_message_is_read) ? $entity->field_message_is_read : (bool) $entity->field_message_is_read->getString(),
      ];

      // Always add a recipient user ID to the message item.
      if ($entity->hasField('field_message_recipient')) {
        if (!empty($entity->field_message_recipient->getValue())) {

          $value = $entity->field_message_recipient->first()->getValue();
          $output['recipient'] = $value['target_id'];
        }
      }

      // Prepares Comment part if Comment field exists.
      if ($entity->hasField('field_message_comment')) {
        $comment = $entity->field_message_comment->first()->get('entity')->getValue();

        // Normalize comment entity with lesson data included.
        if ($comment && $comment_normalized = AnuNormalizerBase::normalizeEntity($comment, ['lesson'])) {
          $output['comment'] = $comment_normalized;
        }
      }

    }
    catch (\Exception $e) {
      $message = new FormattableMarkup('Could not normalize entity. Error: @error', [
        '@error' => $e->getMessage(),
      ]);
      $this->logger->critical($message);
    }

    return $output;
  }

}
