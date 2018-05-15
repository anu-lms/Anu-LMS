<?php

namespace Drupal\anu_events;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\anu_events\Annotation\AnuEvent;
use Drupal\Component\Plugin\Factory\DefaultFactory;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * AnuEvent plugin manager.
 */
class AnuEventPluginManager extends DefaultPluginManager {

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

    $subdir = 'Plugin/AnuEvent';

    $plugin_interface = AnuEventInterface::class;

    // The name of the annotation class that contains the plugin definition.
    $plugin_definition_annotation_name = AnuEvent::class;

    parent::__construct($subdir, $namespaces, $module_handler, $plugin_interface, $plugin_definition_annotation_name);

    $this->alterInfo('anu_event_info');

    $this->setCacheBackend($cache_backend, 'anu_event_info');
  }

  /**
   * {@inheritdoc}
   *
   * Allow the hook name and context to be passed to the constructor.
   */
  public function createInstance($plugin_id, array $configuration = [], $hook = '', array $context = []) {
    $plugin_definition = $this->getDefinition($plugin_id);
    $plugin_class = DefaultFactory::getPluginClass($plugin_id, $plugin_definition);
    // If the plugin provides a factory method, pass the container to it.
    if (is_subclass_of($plugin_class, ContainerFactoryPluginInterface::class)) {
      $plugin = $plugin_class::create(\Drupal::getContainer(), $configuration, $plugin_id, $plugin_definition, $hook, $context);
    }
    else {
      $plugin = new $plugin_class($configuration, $plugin_id, $plugin_definition, $hook, $context);
    }
    return $plugin;
  }

}
