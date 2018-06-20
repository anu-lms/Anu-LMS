<?php

namespace Drupal\anu_lessons;

use Drupal\paragraphs\Entity\Paragraph;

class Lesson {

  /**
   * Load Lesson by paragraph id.
   *
   * @param integer $paragraph_id
   *   Id of Paragraph.
   *
   * @return
   *   Lesson object or Null;
   */
  public function loadByParagraphId($paragraph_id) {
    $lessons = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadByProperties([
        'type' => 'lesson',
        'field_lesson_blocks' => $paragraph_id
      ]);

    return !empty($lessons) ? reset($lessons) : NULL;
  }

  /**
   * Load Lesson's paragraphs filtered by given type.
   *
   * @param integer $lesson_id
   *   Id of Lesson.
   * @param array $types
   *   Paragraph types. Eg: ['media_video', 'image_centered_caption']
   *
   * @return
   *   An array of Paragraph objects.
   */
  public function loadParagraphsByType($lesson, $types = []) {
    $query = \Drupal::entityQuery('paragraph')
      ->condition('parent_id', $lesson->id());
    if (!empty($types)) {
      $query->condition('type', $types, 'IN');
    }

    // Added an additional condition by id to skip ghost paragraphs.
    $lesson_paragraph_ids = array_column($lesson->field_lesson_blocks->getValue(), 'target_id');
    $query->condition('id', $lesson_paragraph_ids, 'IN');

    $ids = $query->execute();
    return Paragraph::loadMultiple($ids);
  }

}
