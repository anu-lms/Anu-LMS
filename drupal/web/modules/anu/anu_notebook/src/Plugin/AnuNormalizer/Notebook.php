<?php

namespace Drupal\anu_notebook\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for Notebook entity.
 *
 * @AnuNormalizer(
 *   id = "notebook_normalizer",
 *   title = @Translation("Notebook normalizer"),
 *   description = @Translation("Normalizes notebook entity"),
 * )
 */
class Notebook extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  public function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'notebook' && $entity->bundle() == 'notebook';
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
      $text = $entity->field_notebook_body->getValue();
      $output = [
        'id' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'fieldNotebookTitle' => $entity->field_notebook_title->getString(),
        'fieldNotebookBody' => ['value' => !empty($text[0]['value']) ? $text[0]['value'] : ''],
      ];

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
