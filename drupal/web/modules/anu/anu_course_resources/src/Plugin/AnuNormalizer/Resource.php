<?php

namespace Drupal\anu_course_resources\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for resource entity.
 *
 * @AnuNormalizer(
 *   id = "resource_normalizer",
 *   title = @Translation("Resource normalizer"),
 *   description = @Translation("Normalizes resource entity"),
 * )
 */
class Resource extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  public function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'paragraph' && $entity->bundle() == 'media_resource';
  }

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $include_fields = []) {
    $output = NULL;
    if (!$this->shouldApply($entity)) {
      return $output;
    }

    try {
      $output = [
        'id' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'fieldParagraphTitle' => $entity->field_paragraph_title->getString(),
      ];

      // Attaches file entity by given param or if title doesn't exists.
      if (in_array('file', $include_fields) || empty($entity->field_paragraph_title->getString())) {
        // Load the file from paragraph.
        $file = $entity->field_paragraph_private_file
          ->first()
          ->get('entity')
          ->getTarget()
          ->getValue();

        $output['file'] = [
          'id' => (int) $file->id(),
          'filename' => $file->filename->getString(),
        ];
      }

      if (in_array('lesson', $include_fields)) {
        $lesson = $entity->getParentEntity();

        // Normalize lesson entity with lesson data included.
        if ($lesson && $lesson_normalized = AnuNormalizerBase::normalizeEntity($lesson)) {
          $output['lesson'] = $lesson_normalized;
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
