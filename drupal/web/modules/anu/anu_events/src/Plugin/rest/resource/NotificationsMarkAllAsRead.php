<?php

namespace Drupal\anu_events\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Remove user tokens.
 *
 * @RestResource(
 *   id = "notifications_mark_all_as_read",
 *   label = @Translation("Mark all notifications as read"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/notifications/mark-all-as-read",
 *   }
 * )
 */
class NotificationsMarkAllAsRead extends ResourceBase {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('anu_events')
    );
  }

  /**
   * Responds to POST requests.
   *
   * Mark all user's notifications as read.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post() {
    try {
      $current_user = \Drupal::currentUser();

      // Loads unread notifications of current user.
      $notifications = \Drupal::entityTypeManager()
        ->getStorage('message')
        ->loadByProperties([
          'field_message_recipient' => $current_user->id(),
          'field_message_is_read' => FALSE,
        ]);

      foreach ($notifications as $notification) {
        $notification->field_message_is_read = TRUE;
        $notification->save();
      }
    }
    catch (\Exception $e) {
      $message = $this->t('There is a problem to mark all notifications as read for user @uid.', ['@uid' => $current_user->id()]);
      $this->logger->warning($message);
      return new ResourceResponse(['message' => $message], 406);
    }
    return new ResourceResponse(TRUE);
  }

}
