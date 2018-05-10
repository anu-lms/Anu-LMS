<?php

namespace Drupal\anu_events;

use Drupal\Component\Render\FormattableMarkup;

class Message {

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
        $paragraph_id = (int) $comment->field_comment_paragraph->getString();
        $lesson = \Drupal::service('anu_lessons.lesson')->loadByParagraphId($paragraph_id);
        $text = $comment->field_comment_text->getValue();

        $response_item['comment'] = [
          'id' => $comment->id(),
          'text' => !empty($text[0]['value']) ? $text[0]['value'] : '',
          'paragraphId' => $paragraph_id,
          'lessonTitle' => !empty($lesson) ? $lesson->label() : '',
        ];
      }
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize message entity. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      \Drupal::logger('anu_events')->critical($message);
    }

    return $response_item;
  }

}
