<?php

namespace Drupal\anu_events\Plugin\Notifier;

/**
 * An abstract implementation of MessageNotifierObject.
 */
abstract class MessageNotifierBase extends \Drupal\message_notify\Plugin\Notifier\MessageNotifierBase {

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
