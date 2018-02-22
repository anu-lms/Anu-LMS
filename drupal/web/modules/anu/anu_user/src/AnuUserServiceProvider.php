<?php

namespace Drupal\anu_user;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

class AnuUserServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    // Replaces default core's auth class with our custom class.
    $definition = $container->getDefinition('user.auth');
    $definition->setClass('Drupal\anu_user\UserAuth');
  }
}
