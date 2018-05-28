<?php

namespace Drupal\anu_comments\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Utility\UrlHelper;

/**
 * Reply to the Comment event.
 *
 * @AnuNormalizer(
 *   id = "comment_normalizer",
 *   title = @Translation("Comment normalizer"),
 *   description = @Translation("Normalizes comment entity"),
 * )
 */
class Comment extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'paragraph_comment' && $entity->bundle() == 'paragraph_comment';
  }

  /**
   * {@inheritdoc}
   */
  function normalize($entity, $include_fields) {
    if ($this->shouldApply($entity)) {

      $text = $entity->field_comment_text->getValue();
      $paragraph_id = (int) $entity->field_comment_paragraph->getString();

      $output = [
        'id' => $entity->id(),
        'uuid' => $entity->uuid(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'fieldCommentText' => ['value' => !empty($text[0]['value']) ? $text[0]['value'] : ''],
        'fieldCommentParagraph' => $paragraph_id,
        'fieldCommentDeleted' => (bool) $entity->field_comment_deleted->getString(),
      ];

      if (in_array('lesson', $include_fields)) {

        $lesson = \Drupal::service('anu_lessons.lesson')->loadByParagraphId($paragraph_id);

        $output['lesson'] = AnuNormalizerBase::normalizeEntity($lesson);
      }

      return $output;
    }

    return $entity;
  }
}
