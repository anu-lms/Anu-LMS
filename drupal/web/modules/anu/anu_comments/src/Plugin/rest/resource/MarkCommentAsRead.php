<?php

namespace Drupal\anu_comments\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a resource to validate reset password link and reset password.
 *
 * @RestResource(
 *   id = "mark_comment_as_read",
 *   label = @Translation("Mark comments as read"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/comments/mark-as-read",
 *   }
 * )
 */
class MarkCommentAsRead extends ResourceBase {

  /**
   * Responds to POST requests.
   *
   * Mark given comments as read by current user.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {

    try {
      $comments = $data['comment_ids'];
    }
    catch (\Exception $e) {

      // Log an error.
      $message = $this->t('Could not mark comments as read.');
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    $response = new ResourceResponse($comments, 200);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

}
