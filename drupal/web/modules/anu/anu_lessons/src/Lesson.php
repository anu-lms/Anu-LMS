<?php

namespace Drupal\anu_lessons;

use Drupal\node\NodeInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * Helper service for Lesson entity.
 */
class Lesson {

  /**
   * Load Lesson by paragraph id.
   *
   * @param int $paragraph_id
   *   Id of Paragraph.
   *
   * @return \Drupal\node\NodeInterface|null
   *   Lesson object or Null;
   */
  public function loadByParagraphId($paragraph_id) {
    $lessons = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadByProperties([
        'type' => 'lesson',
        'field_lesson_blocks' => $paragraph_id,
      ]);

    return !empty($lessons) ? reset($lessons) : NULL;
  }

  /**
   * Load Lesson's paragraphs filtered by given type.
   *
   * @param \Drupal\node\NodeInterface $lesson
   *   Lesson object.
   * @param array $types
   *   Paragraph types. Eg: ['media_video', 'image_centered_caption'].
   *
   * @return array
   *   An array of Paragraph objects.
   */
  public function loadParagraphsByType(NodeInterface $lesson, array $types = []) {
    $lesson_paragraph_ids = array_column($lesson->field_lesson_blocks->getValue(), 'target_id');
    // Returns an empty array if lesson doesn't contain paragraphs (buy might have some ghost, not assigned to lesson).
    if (empty($lesson_paragraph_ids)) {
      return [];
    }

    $query = \Drupal::entityQuery('paragraph')
      ->condition('parent_id', $lesson->id());
    if (!empty($types)) {
      $query->condition('type', $types, 'IN');
    }

    // Added an additional condition by id to skip ghost paragraphs.
    $query->condition('id', $lesson_paragraph_ids, 'IN');

    $ids = $query->execute();
    return Paragraph::loadMultiple($ids);
  }

}
