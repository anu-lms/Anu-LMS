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
class FrontendPush extends MessageNotifierBase {

  /**
   * {@inheritdoc}
   */
  public function deliver(array $output = []) {

    // Load notification message.
    $messageService = \Drupal::service('anu_events.message');
    $message = $messageService->normalize($output['message']);

    // Get websocket URL.
    $websocket = \Drupal::request()->getSchemeAndHttpHost();

    // Send notification message to websocket.
    try {

      $httpContext = [
        'header' => [
          'Origin: ' . $websocket,
        ],
      ];

      $client = new Client(new Version2X($websocket), [
        'context' => [
          'http' => $httpContext,
        ],
      ]);

      $client->initialize();
      $client->emit('notification', \Drupal::service('serializer')
        ->normalize($message, 'json'));
      $client->close();
    } catch (\Exception $exception) {

      \Drupal::logger('anu_events')
        ->critical('Could not write notification to socket. Error: @error', [
            '@error' => $exception->getMessage(),
          ]
        );
    }

    // TODO: Fix exposure of user id, email, etc.
    // TODO: Filter notifications on socket level
    return TRUE;
  }

}
