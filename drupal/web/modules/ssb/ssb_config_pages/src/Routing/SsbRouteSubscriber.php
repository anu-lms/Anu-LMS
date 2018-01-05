<?php

namespace Drupal\ssb_config_pages\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class SsbRouteSubscriber extends RouteSubscriberBase {
  
  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    // Change title for config_pages routes.
    $entities = \Drupal::entityTypeManager()->getStorage('config_pages')->loadMultiple();
    foreach ($entities as $entity){
      if ($route = $collection->get('config_pages.' . $entity->bundle())) {
        $route->setDefault('_title', $entity->label());
      }
    }
  }
  
}
