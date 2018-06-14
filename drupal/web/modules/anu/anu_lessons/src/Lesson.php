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
  public function loadParagraphsByType($lesson_id, $types = []) {
    $query = \Drupal::entityQuery('paragraph')
      ->condition('parent_id', $lesson_id);
    if (!empty($types)) {
      $query->condition('type', $types, 'IN');
    }

    $ids = $query->execute();
    return Paragraph::loadMultiple($ids);
  }

}
