<?php

namespace Drupal\anu_events;

interface AnuEventInterface {

  /**
   * Returns true if Event should be triggered.
   */
  public function shouldTrigger($hook, $context);

  /**
   * Check if event should be triggered, creates Message entity and notify channels.
   */
  public function trigger($hook, $context);
}
