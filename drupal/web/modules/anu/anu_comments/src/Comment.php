<?php

namespace Drupal\anu_comments;

use Drupal\Core\Url;
use Drupal\user\Entity\User;
use Drupal\Core\Site\Settings;
use Drupal\Core\Entity\EntityInterface;
use Drupal\anu_normalizer\AnuNormalizerBase;

/**
 * Helper service for comment entity.
 */
class Comment {

  /**
   * Looking for root parent comment recursively.
   */
  public function getRootComment($comment) {
    if (!empty($comment->field_comment_parent->getValue())) {
      $parent = $comment->field_comment_parent
        ->first()
        ->get('entity')
        ->getValue();

      return $this->getRootComment($parent);
    }

    return $comment;
  }

  /**
   * Push comment entity to the socket.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   Comment entity.
   * @param string $action
   *   Action, can be `insert`, `update` or `delete`.
   */
  public function pushEntity(EntityInterface $entity, $action) {

    try {

      // Prepare comment entity to send to frontend.
      $normalizedEntity = AnuNormalizerBase::normalizeEntity($entity, ['lesson', 'uid']);

      // isRead value in pushed comment calculated regarding user who pushed it.
      // Current user pushes comment to other users, the value will be wrong
      // for other users because it's calculated for the current user.
      // We say New pushed comment is always unread for other users by default.
      if ($action == 'insert') {
        $normalizedEntity['isRead'] = FALSE;
      }

      if (!$normalizedEntity) {
        throw new \Exception("Entity can't be normalized.");
      }

      // Prepares data to push.
      $data = [
        'action' => $action,
        'data' => $normalizedEntity,
      ];
      \Drupal::service('anu_websocket.websocket')->emit('comment', $data);
    }
    catch (\Exception $exception) {

      \Drupal::logger('anu_comments')
        ->critical('Could not write entity to socket. Error: @error', [
          '@error' => $exception->getMessage(),
        ]);
    }
  }

  /**
   * Sends an email notification to the recipient.
   */
  public function sendEmailNotification($message) {
    $message = AnuNormalizerBase::normalizeEntity($message, ['lesson']);

    // Prepares message title.
    $titleCopy = 'replied to your comment in';
    if ($message['bundle'] === 'add_comment_to_thread') {
      $titleCopy = 'commented in your thread in';
    }
    elseif ($message['bundle'] === 'mentioned_in_comment') {
      $titleCopy = 'mentioned you in a comment on';
    }

    // Prepares triggerer name.
    $triggererName = $message['triggerer']['name'];
    if (!empty($message['triggerer']['fieldFirstName']) && !empty($message['triggerer']['fieldLastName'])) {
      $triggererName = $message['triggerer']['fieldFirstName'] . ' ' . $message['triggerer']['fieldLastName'];
    }

    // Preapares Comment link and body.
    $comment = $message['comment'];
    $commentBody = $comment['fieldCommentText']['value'];
    $lessonTitle = $comment['lesson']['title'];
    $lessonUrl = 'course' . $comment['lesson']['fieldLessonCourse']['path']['alias'] . $comment['lesson']['path']['alias'];
    $frontend_domain = Settings::get('frontend_domain');

    // Compose comment link.
    $commentLink = Url::fromUri($frontend_domain . $lessonUrl, [
      'absolute' => TRUE,
      'query' => [
        'comment' => $comment['fieldCommentParagraph'] . '-' . $comment['id'],
      ],
    ]);
    // Prepares email subject.
    $params['subject'] = t("@triggerer_name $titleCopy @lesson_title", [
      '@triggerer_name' => $triggererName,
      '@lesson_title' => $lessonTitle,
    ]);

    // Prepares email body.
    $params['body'] = $params['subject'] . ':';
    $params['body'] .= '<br />"' . trim(strip_tags($commentBody)) . '"';
    $params['body'] .= '<br />' . $commentLink->toString();

    // Send an email to recipient.
    $recipient = User::load($message['recipient']);
    $to = $recipient->getEmail();
    $result = \Drupal::service('plugin.manager.mail')
      ->mail('anu_events', 'comment_email_notification', $to, $recipient->getPreferredLangcode(), $params, NULL, TRUE);

    // Returns an error in case of any issues.
    if ($result['result'] != TRUE) {
      \Drupal::logger('anu_comments_notifier')
        ->error(t('There was a problem sending email notification to %email.', ['%email' => $to]));
      return FALSE;
    }
    return TRUE;
  }

}
