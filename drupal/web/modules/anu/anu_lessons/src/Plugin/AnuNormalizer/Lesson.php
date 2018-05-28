<?php

namespace Drupal\anu_lessons\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;

/**
 *
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
    if ($this->shouldApply($entity)) {
      $alias_service = \Drupal::service('path.alias_manager');

      $output = [
        'nid' => $entity->id(),
        'uuid' => $entity->uuid(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'title' => $entity->title->getString(),
        'fieldIsAssessment' => (bool) $entity->field_is_assessment->getString(),
        'path' => [
          'alias' => $alias_service->getAliasByPath('/node/' . $entity->id())
        ],
        'fieldLessonCourse' => [
          'path' => [
            'alias' => $alias_service->getAliasByPath('/node/' . $entity->field_lesson_course->getString())
          ],
        ],
      ];

      return $output;
    }

    return $entity;
  }
}
