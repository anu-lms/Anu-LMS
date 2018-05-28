<?php

namespace Drupal\anu_comments\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Utility\UrlHelper;

/**
 * Reply to the Comment event.
 *
 * @AnuNormalizer(
 *   id = "comment_normalizer",
 *   title = @Translation("Comment normalizer"),
 *   description = @Translation("Normalizes comment entity"),
 * )
 */
class Comment extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'paragraph_comment' && $entity->bundle() == 'paragraph_comment';
  }

  /**
   * {@inheritdoc}
   */
  function normalize($entity, $include_fields) {
    if ($this->shouldApply($entity)) {

      $text = $entity->field_comment_text->getValue();
      $paragraph_id = (int) $entity->field_comment_paragraph->getString();

      $output = [
        'id' => $entity->id(),
        'text' => !empty($text[0]['value']) ? $text[0]['value'] : '',
        'paragraphId' => $paragraph_id,
      ];

      if (in_array('url', $include_fields) || in_array('lesson_title', $include_fields)) {

        $lesson = \Drupal::service('anu_lessons.lesson')->loadByParagraphId($paragraph_id);

        if (in_array('lesson_title', $include_fields)) {
          $output['lessonTitle'] = !empty($lesson) ? $lesson->label() : '';
        }

        if (in_array('url', $include_fields)) {
          // Generates Comment's url.
          // @todo: Backend shouldn't define url structure for the frontend.
          $lesson_url = \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $lesson->id());
          $course_url = \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $lesson->field_lesson_course->getString());
          $entityUrl = '';
          if (!empty($lesson_url) && !empty($course_url)) {
            $entityUrl = '/course' . $course_url . $lesson_url . '?' . UrlHelper::buildQuery(['comment' => $paragraph_id . '-' . $entity->id()]);
          }

          $output['url'] = $entityUrl;
        }
      }

      return $output;
    }

    return $entity;
  }
}
