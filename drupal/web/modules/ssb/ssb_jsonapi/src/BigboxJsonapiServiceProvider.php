<?php

namespace Drupal\ssb_jsonapi;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Class DummyServiceProvider
 *
 * @package Drupal\ssb_jsonapi
 */
class SsbJsonapiServiceProvider extends ServiceProviderBase {
  
  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    $definition = $container->getDefinition('redirect_response_subscriber');
    $definition->setClass('Drupal\ssb_jsonapi\SsbJsonapiRedirectResponseSubscriber');
  }
  
}
