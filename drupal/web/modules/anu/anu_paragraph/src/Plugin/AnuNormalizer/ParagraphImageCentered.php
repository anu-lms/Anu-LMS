<?php

namespace Drupal\anu_paragraph\Plugin\AnuNormalizer;

use Drupal\image\Entity\ImageStyle;
use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for Paragraph Media video entity.
 *
 * @AnuNormalizer(
 *   id = "paragraph_image_centered_normalizer",
 *   title = @Translation("Paragraph Centered image normalizer"),
 *   description = @Translation("Normalizes Centered image entity"),
 * )
 */
class ParagraphImageCentered extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'paragraph' && $entity->bundle() == 'image_centered_caption';
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
      $output = [
        'id' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'type' => $entity->bundle(),
        'created' => (int) $entity->created->getString(),
        'fieldParagraphTitle' => $entity->field_paragraph_title->getString(),
      ];

      if (!$entity->field_paragraph_image->isEmpty()) {
        $uri = $entity->field_paragraph_image->entity->getFileUri();
        $image_url = ImageStyle::load('576x450')->buildUrl($uri);

        $output['fieldParagraphImage'] = [
          'uri' => [
            'url' => $image_url,
          ]
        ];
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
