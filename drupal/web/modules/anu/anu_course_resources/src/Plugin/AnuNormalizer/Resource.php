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
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'paragraph' && $entity->bundle() == 'media_resource';
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
      // Load the file from paragraph.
      $file = $entity->field_paragraph_private_file
        ->first()
        ->get('entity')
        ->getTarget()
        ->getValue();

      $output = [
        'id' => (int) $entity->id(),
        'title' => $entity->field_paragraph_title->getString(),
        'fileId' => (int) $file->id(),
        'fileName' => $file->filename->getString(),
      ];
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize entity. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
    }

    return $output;
  }
}
