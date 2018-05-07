<?php

namespace Drupal\anu_events\Plugin\Notifier;

use Drupal\message_notify\Plugin\Notifier\MessageNotifierBase;

/**
 * An abstract implementation of MessageNotifierObject.
 */
abstract class MessageNotifierObject extends MessageNotifierBase {

  /**
   * {@inheritdoc}
   *
   * Overrides parent send method to return raw message object
   * without view mode wrapping.
   */
  public function send() {
    $output = ['message' => $this->message];

    $result = $this->deliver($output);
    $this->postSend($result, $output);

    return $result;
  }

}
