<?php

namespace Drupal\anu_paragraph\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for Paragraph Media video entity.
 *
 * @AnuNormalizer(
 *   id = "paragraph_media_video_normalizer",
 *   title = @Translation("Paragraph Media video normalizer"),
 *   description = @Translation("Normalizes Media video entity"),
 * )
 */
class ParagraphMediaVideo extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'paragraph' && $entity->bundle() == 'media_video';
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
      ];

//      if (!$entity->field_paragraph_url->isEmpty()) {
//        $uri = $entity->field_paragraph_url->entity->getFileUri();
//        //$image_url = ImageStyle::load('576x450')->buildUrl($uri);
//
//        $output['fieldParagraphImage'] = [
//          'uri' => $uri
//        ];
//      }

    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize entity. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
    }

    return $output;
  }
}
