<?php

namespace Drupal\anu_notebook\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;

/**
 *
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
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'notebook' && $entity->bundle() == 'notebook';
  }

  /**
   * {@inheritdoc}
   */
  function normalize($entity, $include_fields) {
    if ($this->shouldApply($entity)) {

      $text = $entity->field_notebook_body->getValue();
      $output = [
        'id' => $entity->id(),
        'uuid' => $entity->uuid(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'fieldNotebookTitle' => $entity->field_notebook_title->getString(),
        'fieldNotebookBody' => ['value' => !empty($text[0]['value']) ? $text[0]['value'] : ''],
      ];

      return $output;
    }

    return $entity;
  }
}
