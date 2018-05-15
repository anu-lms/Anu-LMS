<?php

namespace Drupal\anu_events\Plugin\Notifier;

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

/**
 * Frontend Push notifier.
 *
 * @Notifier(
 *   id = "frontend_push",
 *   title = @Translation("Frontend push"),
 *   description = @Translation("Send push notification to the frontend"),
 * )
 */
class FrontendPush extends MessageNotifierObject {

  /**
   * {@inheritdoc}
   */
  public function deliver(array $output = []) {

    // Load notification message.
    $messageService = \Drupal::service('anu_events.message');
    $message = $messageService->normalize($output['message']);

    // Get websocket URL.
    $websocket_port = 8000;
    $websocket_host = \Drupal::request()->getSchemeAndHttpHost();
    $websocket =  $websocket_host . ':' . $websocket_port;

    // Send notification message to websocket.
    $client = new Client(new Version2X($websocket));
    $client->initialize();
    $client->emit('notification', \Drupal::service('serializer')->normalize($message, 'json'));
    $client->close();

    // TODO: Fix exposure of user id, email, etc.
    // TODO: Error handling
    // TODO: Filter notifications on socket level.

    //\Drupal::logger('anu_events')
    //  ->notice($output['message']->getText()[0] . ' (Notification has been sent to the frontend)');
    return TRUE;
  }

}
