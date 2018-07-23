<?php

namespace Drupal\anu_events\Plugin\Notifier;

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;
use Drupal\anu_normalizer\AnuNormalizerBase;

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

    try {

      // Load notification message.
      $message = AnuNormalizerBase::normalizeEntity($output['message'], ['lesson']);

      if (!$message) {
        throw new \Exception("Message entity can't be normalized.");
      }
      \Drupal::service('anu_websocket.websocket')->emit('notification', $message);
    }
    catch (\Exception $exception) {

      \Drupal::logger('anu_events')
        ->critical('Could not write notification to socket. Error: @error', [
          '@error' => $exception->getMessage(),
        ]);
    }

    // TODO: Fix exposure of user id, email, etc.
    // TODO: Filter notifications on socket level.
    return TRUE;
  }

}
