<?php

namespace Drupal\anu_comments\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for Comment entity.
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
    $output = NULL;
    if (!$this->shouldApply($entity)) {
      return $output;
    }

    try {
      $text = $entity->field_comment_text->getValue();
      $paragraph_id = (int) $entity->field_comment_paragraph->getString();

      $output = [
        'id' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'fieldCommentText' => ['value' => !empty($text[0]['value']) ? $text[0]['value'] : ''],
        'fieldCommentParagraph' => $paragraph_id,
        'fieldCommentDeleted' => (bool) $entity->field_comment_deleted->getString(),
      ];

      // Attaches lesson data if necessary.
      if (in_array('lesson', $include_fields)) {

        $lesson = \Drupal::service('anu_lessons.lesson')->loadByParagraphId($paragraph_id);

        // Normalize lesson entity with lesson data included.
        if ($lesson && $lesson_normalized = AnuNormalizerBase::normalizeEntity($lesson)) {
          $output['lesson'] = $lesson_normalized;
        }
      }

    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize entity. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
    }

    return $output;
  }
}
