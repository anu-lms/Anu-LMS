<?php

namespace Drupal\anu_normalizer;

use Drupal\Component\Plugin\DerivativeInspectionInterface;
use Drupal\Component\Plugin\PluginInspectionInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

interface AnuNormalizerInterface extends ContainerFactoryPluginInterface, PluginInspectionInterface, DerivativeInspectionInterface  {

  /**
   * Returns true if Event should be triggered.
   */
  public function shouldApply($entity);

  /**
   * Check if event should be triggered, creates Message entity and notify channels.
   */
  public function normalize($entity, $include_fields);
}
