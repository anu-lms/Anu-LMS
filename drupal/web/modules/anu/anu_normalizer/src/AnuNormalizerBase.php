<?php

namespace Drupal\anu_normalizer;

use Drupal\Component\Plugin\PluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Psr\Log\LoggerInterface;

abstract class AnuNormalizerBase extends PluginBase implements AnuNormalizerInterface {

  /**
   * Returns true if Normalizer can be applied to the given entity.
   */
  public abstract function shouldApply($entity);

  /**
   * Applies normalizer for given entity.
   * Returns an object with fields given in $include_fields parameter.
   */
  public abstract function normalize($entity, $include_fields);

  /**
   *
   */
  public static function normalizeEntity($entity, $include_fields) {
    $anu_normalizer_plugins = \Drupal::service('plugin.manager.anu_normalizer')->getDefinitions();
    foreach ($anu_normalizer_plugins as $anu_normalizer_plugin) {
      $anu_normalizer = \Drupal::service('plugin.manager.anu_normalizer')->createInstance($anu_normalizer_plugin['id']);

      // Normalizer by first appropriate normalizer.
      if ($anu_normalizer->shouldApply($entity)) {
        return $anu_normalizer->normalize($entity, $include_fields);
      }
    }
    return $entity;
  }

  /**
   * Constructs the plugin.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Logger\LoggerChannelInterface $logger
   *   The message_notify logger channel.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LoggerInterface $logger) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->logger = $logger;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('logger.factory')->get('anu_normalizer')
    );
  }

}
