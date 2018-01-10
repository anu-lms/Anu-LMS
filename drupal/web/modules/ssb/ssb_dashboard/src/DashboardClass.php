<?php

namespace Drupal\ssb_dashboard;

use Drupal\config_pages\Entity\ConfigPagesType;
use Drupal\taxonomy\Entity\Vocabulary;


class DashboardClass {

  public function getRouteTaxanomy() {
    return [];
    $categories = [];
    $vocabularies = Vocabulary::loadMultiple();
    foreach ($vocabularies as $vocabulary) {
      $urlObject = $vocabulary->toUrl('overview-form');
      $categories[] = [
        'routeParam' => $urlObject->getRouteParameters(),
        'routeName' => $urlObject->getRouteName(),
        'name' => $vocabulary->get('name'),
        'description' => $vocabulary->get('description'),
      ];
    }
    return $categories;
  }

  public function getRouteConfigPages($include_bundle = [], $exclude_bundle = []) {

    $pages = [];
    $types = ConfigPagesType::loadMultiple();
    foreach ($types as $type) {

      // Check permission to create a content of this entity type.
      if (!\Drupal::entityTypeManager()->getAccessControlHandler('config_pages')->createAccess($type->id())) {
        continue;
      }

      if (count($include_bundle)) {
        $condition = in_array($type->id(), $include_bundle);
      }
      elseif (count($exclude_bundle)) {
        $condition = !in_array($type->id(), $exclude_bundle);
      }
      else {
        $condition = TRUE;
      }

      if ($condition) {
        $routeParam = [];
        $routeName = NULL;
        $menu = $type->get('menu');
        $path = !empty($menu['path']) ? $menu['path'] : NULL;
        $weight = !empty($menu['weight']) ? $menu['weight'] : '0';
        $description = !empty($menu['description']) ? $menu['description'] : NULL;

       if ($path) {
          $router = \Drupal::service('router.no_access_checks');
          $route = $router->match($path);
          $routeName = $route['_route'];
        }
        else {
          $entities = \Drupal::entityTypeManager()->getStorage('config_pages')->loadMultiple();
          foreach ($entities as $entity) {
            if ($entity->bundle() === $type->getOriginalId()) {
              $urlObject = $entity->toUrl();
              $routeParam = $urlObject->getRouteParameters();
              $routeName = $urlObject->getRouteName();
            }
          }
        }
        if (!empty($routeName)){
          $pages[] = [
            'name' => $type->label(),
            'routeParam' => $routeParam,
            'routeName' => $routeName,
            'description' => $description,
            'weight' => $weight,
          ];
        }
      }
    }

    $weight = [];
    foreach ($pages as $key => $row) {
      $weight[$key] = $row['weight'];
    }
    array_multisort($weight, SORT_ASC, $pages);

    return $pages;
  }

}
