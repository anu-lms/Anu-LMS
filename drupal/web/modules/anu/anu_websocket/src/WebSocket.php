<?php

namespace Drupal\anu_websocket;

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

/**
 * Helper service for websocket.
 */
class WebSocket {

  /**
   * Push data to the socket.
   *
   * @param array $data
   *   An array with data to push.
   */
  public function emit(array $data) {

    try {
      // Get websocket URL.
      $websocket = \Drupal::request()->getSchemeAndHttpHost();

      // Prepares websocket config.
      $httpContext = [
        'header' => [
          'Origin: ' . $websocket,
        ],
      ];

      // Initialize client.
      $client = new Client(new Version2X($websocket, [
        'context' => [
          'http' => $httpContext,
        ],
      ]));

      // Send entity to websocket.
      $client->initialize();
      $client->emit('comment', \Drupal::service('serializer')->normalize($data, 'json'));
      $client->close();
    }
    catch (\Exception $exception) {

      \Drupal::logger('anu_websocket')
        ->critical('Could not write data to socket. Error: @error', [
          '@error' => $exception->getMessage(),
        ]);
    }
  }

}
