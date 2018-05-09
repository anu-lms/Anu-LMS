<?php

namespace Drupal\anu_lessons;

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

}
