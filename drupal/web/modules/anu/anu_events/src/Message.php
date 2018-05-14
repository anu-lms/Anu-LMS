<?php

namespace Drupal\anu_events;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Component\Utility\UrlHelper;

class Message {

  /**
   * Returns an object prepared to pass to frontend from given Message entity.
   */
  public function normalize($message) {
    $response_item = NULL;
    try {
      // Prepared common comment data.
      $response_item = [
        'id' => $message->id(),
        'bundle' => $message->bundle(),
        'created' => (int) $message->created->getString(),
        'triggerer' => $message->uid->first()->get('entity')->getValue(),
        'isRead' => ($message->id() % 2 == 0), // @todo: replace with proper value.
        //'isRead' => $message->field_is_read->getString(),
      ];

      // Prepares Comment part if Comment field exists.
      if ($message->hasField('field_message_comment')) {
        $comment = $message->field_message_comment->first()->get('entity')->getValue();
        $response_item['comment'] = $this->normalizeComment($comment);
      }
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize message entity. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      \Drupal::logger('anu_events')->critical($message);
    }

    return $response_item;
  }

  /**
   * Returns a comment object prepared to pass to frontend from given Message entity.
   */
  protected function normalizeComment($comment) {
    $paragraph_id = (int) $comment->field_comment_paragraph->getString();
    $lesson = \Drupal::service('anu_lessons.lesson')->loadByParagraphId($paragraph_id);
    $text = $comment->field_comment_text->getValue();

    // Generates Comment's url.
    $lesson_url = \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $lesson->id());
    $course_url = \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $lesson->field_lesson_course->getString());
    $commentUrl = '/course' . $course_url . $lesson_url . '?' . UrlHelper::buildQuery(['comment' => $paragraph_id . '-' . $comment->id()]);

    return [
      'id' => $comment->id(),
      'text' => !empty($text[0]['value']) ? $text[0]['value'] : '',
      'paragraphId' => $paragraph_id,
      'lessonTitle' => !empty($lesson) ? $lesson->label() : '',
      'commentUrl' => $commentUrl,
    ];
  }

  /**
   * Deletes message entities created for comment with given Id.
   */
  public function deleteByCommentId($commentId) {
    try {
      // Load paragraphs of the resource type for course lessons.
      $entities = \Drupal::entityTypeManager()
        ->getStorage('message')
        ->loadByProperties([
          'field_message_comment' => $commentId
        ]);

      // Delete all existing notifications for deleted comment.
      $controller = \Drupal::entityTypeManager()->getStorage('message');
      $controller->delete($entities);

    } catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not remove notifications for deleted comment with id @comment_id. Error: @error', [
        '@comment_id' => $commentId,
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_events')->error($message);
    }
  }
}
