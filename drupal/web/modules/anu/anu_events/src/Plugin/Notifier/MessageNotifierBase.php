<?php

namespace Drupal\anu_events\Plugin\Notifier;

use Drupal\message_notify\Plugin\Notifier\MessageNotifierBase as MessageNotifierBaseCore;

/**
 * An abstract implementation of MessageNotifierObject.
 */
abstract class MessageNotifierBase extends MessageNotifierBaseCore {

  /**
   * Returns TRUE if channel should be triggered.
   */
  public function shouldTrigger() {
    return TRUE;
  }

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
