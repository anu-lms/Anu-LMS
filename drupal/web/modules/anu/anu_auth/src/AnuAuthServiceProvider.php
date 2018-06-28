<?php

namespace Drupal\anu_auth;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Modifies existing services.
 */
class AnuAuthServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {

    // Replace Simple Oauth's auth swap class to avoid issues with
    // http password protected environments when making calls from
    // the frontend. The class itself does nothing, just takes a place
    // of the Simple Oauth's class.
    $definition = $container->getDefinition('simple_oauth.http_middleware.basic_auth_swap');
    $definition->setClass('Drupal\anu_auth\HttpMiddleware\BasicAuthSwap');
  }

}
