<?php

namespace Drupal\anu_normalizer;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\anu_normalizer\Annotation\AnuNormalizer;

/**
 * AnuNormalizer plugin manager.
 */
class AnuNormalizerPluginManager extends DefaultPluginManager {

  /**
   * Creates the discovery object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {

    $subdir = 'Plugin/AnuNormalizer';

    $plugin_interface = AnuNormalizerInterface::class;

    // The name of the annotation class that contains the plugin definition.
    $plugin_definition_annotation_name = AnuNormalizer::class;

    parent::__construct($subdir, $namespaces, $module_handler, $plugin_interface, $plugin_definition_annotation_name);

    $this->alterInfo('anu_normalizer_info');

    $this->setCacheBackend($cache_backend, 'anu_normalizer_info');
  }

}
