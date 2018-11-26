<?php

namespace Drupal\anu_user;

use Drupal\Component\Render\FormattableMarkup;

/**
 * Helper service for comment entity.
 */
class Mentions {

  /**
   * Updates mentions in comments if username has changed.
   *
   * @param int $uid
   *   User ID.
   * @param string $old_username
   *   Old name of a user.
   * @param string $new_username
   *   Updated name of a user.
   */
  public function update($uid, $old_username, $new_username) {
    // Check if someone already mentioned this user in comments.
    try {
      $comment_ids = \Drupal::entityQuery('paragraph_comment')
        ->condition('field_comment_mentions', $uid, 'IN')
        ->execute();
      if ($comment_ids) {
        $controller = \Drupal::entityTypeManager()->getStorage('paragraph_comment');
        $comments = $controller->loadMultiple($comment_ids);
        /** @var Drupal\Core\Entity\EntityInterface $comment */
        foreach ($comments as $comment) {
          $comment_text = $comment->field_comment_text->getValue();
          $comment_text[0]['value'] = str_replace("@$old_username", "@$new_username", $comment_text[0]['value']);
          $comment->set('field_comment_text', $comment_text);
          $controller->save($comment);
        }
      }
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not update user @uid mentions in comments. Error: @error', [
        '@uid' => $uid,
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_user')->error($message);
    }
  }

}
