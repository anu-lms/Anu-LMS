<?php

namespace Drupal\anu_events;

use Drupal\Component\Plugin\DerivativeInspectionInterface;
use Drupal\Component\Plugin\PluginInspectionInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

interface AnuEventInterface extends ContainerFactoryPluginInterface, PluginInspectionInterface, DerivativeInspectionInterface  {

  /**
   * Returns true if Event should be triggered.
   */
  public function shouldTrigger();

  /**
   * Check if event should be triggered, creates Message entity and notify channels.
   */
  public function trigger();
}
