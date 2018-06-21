<?php

namespace Drupal\anu_lessons\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for Lesson node.
 *
 * @AnuNormalizer(
 *   id = "lesson_normalizer",
 *   title = @Translation("Lesson normalizer"),
 *   description = @Translation("Normalizes lesson entity"),
 * )
 */
class Lesson extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'node' && $entity->bundle() == 'lesson';
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
      $alias_service = \Drupal::service('path.alias_manager');

      $output = [
        'nid' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'title' => $entity->title->getString(),
        'path' => [
          'alias' => $alias_service->getAliasByPath('/node/' . $entity->id())
        ],
        'fieldIsAssessment' => (bool) $entity->field_is_assessment->getString(),
        'fieldLessonCourse' => [
          'path' => [
            'alias' => $alias_service->getAliasByPath('/node/' . $entity->field_lesson_course->getString())
          ],
        ],
      ];

      // Attaches media paragraphs data if necessary.
      if (in_array('media', $include_fields)) {
        $output['fieldLessonBlocks'] = [];

        // Load lesson's paragraphs by given types.
        $types = ['media_video', 'image_centered_caption'];
        $media_blocks = \Drupal::service('anu_lessons.lesson')->loadParagraphsByType($entity, $types);

        foreach ($media_blocks as $media_block_entity) {
          // Normalize media paragraph entity.
          if ($block_normalized = AnuNormalizerBase::normalizeEntity($media_block_entity)) {
            $output['fieldLessonBlocks'][] = $block_normalized;
          }
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
