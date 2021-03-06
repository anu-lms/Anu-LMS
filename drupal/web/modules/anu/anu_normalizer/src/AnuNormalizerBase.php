<?php

namespace Drupal\anu_normalizer;

use Psr\Log\LoggerInterface;
use Drupal\Component\Plugin\PluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin to normalize entities.
 */
abstract class AnuNormalizerBase extends PluginBase implements AnuNormalizerInterface {

  /**
   * Returns true if Normalizer can be applied to the given entity.
   */
  abstract public function shouldApply($entity);

  /**
   * Applies normalizer for given entity.
   *
   * Returns normalized object with fields given in $include_fields parameter.
   */
  abstract public function normalize($entity, $include_fields);

  /**
   * Normalize entity by appropriate AnuNormalizer plugin.
   */
  public static function normalizeEntity($entity, $include_fields = NULL) {
    // Load list of existing plugins.
    $anu_normalizer_plugins = \Drupal::service('plugin.manager.anu_normalizer')->getDefinitions();
    foreach ($anu_normalizer_plugins as $anu_normalizer_plugin) {
      $anu_normalizer = \Drupal::service('plugin.manager.anu_normalizer')->createInstance($anu_normalizer_plugin['id']);

      // Normalize by first appropriate normalizer.
      if ($anu_normalizer->shouldApply($entity)) {

        if (!is_null($include_fields)) {
          // Pass $include_fields value to the normalize function if the value was passed.
          return $anu_normalizer->normalize($entity, $include_fields);
        }
        else {
          // We should use default values for $include_fields variable inside normalize method,
          // ff nothing passed to the function.
          return $anu_normalizer->normalize($entity);
        }
      }
    }

    // Returns NULL if entity wasn't normalized.
    return NULL;
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
   * @param \Psr\Log\LoggerInterface $logger
   *   The anu_normalizer logger channel.
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
