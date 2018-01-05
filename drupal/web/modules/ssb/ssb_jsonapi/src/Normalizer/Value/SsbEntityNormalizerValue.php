<?php

namespace Drupal\ssb_jsonapi\Normalizer\Value;

use Drupal\jsonapi\Normalizer\Value\EntityNormalizerValue;
use Drupal\config_pages\Entity\ConfigPagesType;
use Drupal\Core\Entity\Exception\UndefinedLinkTemplateException;
use Drupal\Core\Url;

class SsbEntityNormalizerValue extends EntityNormalizerValue{
  
  public function rasterizeValue() {
    // Create the array of normalized fields, starting with the URI.
    $rasterized = parent::rasterizeValue();
   
    // Add edit link to the frontend.
    if ($this->entity->access('edit', \Drupal::currentUser())){
      $pathChange = NULL;
  
      // For Config_pages check if link was changed.
      if ($this->entity->getEntityTypeId() === 'config_pages'){
        $type=$this->entity->bundle();
        $type = ConfigPagesType::load($type);
        $menu = $type->get('menu');
        $pathChange = !empty($menu['path']) ? $menu['path'] : NULL;
      }
      
      if (!empty($pathChange)) {
        $router = \Drupal::service('router.no_access_checks');
        $route = $router->match($pathChange);
        $routeName = $route['_route'];
        $rasterized['links']['edit'] = Url::fromRoute($routeName)->toString();
      }
      else{
        try {
          $url = $this->entity->toUrl('edit-form');
          if (!empty($url)) {
            $rasterized['links']['edit'] = $url->toString();
          }
        }
        catch (UndefinedLinkTemplateException $e) {}
      }
    }
    
    return $rasterized;
  }
  
}
