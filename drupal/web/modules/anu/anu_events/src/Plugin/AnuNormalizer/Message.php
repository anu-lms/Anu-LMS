<?php

namespace Drupal\anu_events\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 *
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
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'message';
  }

  /**
   * {@inheritdoc}
   */
  function normalize($entity, $include_fields) {
    if ($this->shouldApply($entity)) {

      try {
        // Prepared common comment data.
        $output = [
          'id' => (int) $entity->id(),
          'uuid' => $entity->uuid(),
          'bundle' => $entity->bundle(),
          'created' => (int) $entity->created->getString(),
          'triggerer' => $entity->uid->first()->get('entity')->getValue(),
          'isRead' => (bool) $entity->field_message_is_read->getString(),
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
          $output['comment'] = AnuNormalizerBase::normalizeEntity($comment, ['lesson']);
        }
      } catch(\Exception $e) {
        $entity = new FormattableMarkup('Could not normalize message entity. Error: @error', [
          '@error' => $e->getMessage()
        ]);
        \Drupal::logger('anu_events')->critical($entity);
      }

      return $output;
    }

    return $entity;
  }
}
