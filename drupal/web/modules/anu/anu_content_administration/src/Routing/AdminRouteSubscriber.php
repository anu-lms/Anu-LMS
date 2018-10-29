<?php
namespace Drupal\anu_content_administration\Routing;

use Symfony\Component\Routing\Route;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResultAllowed;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

class AdminRouteSubscriber extends RouteSubscriberBase  {

  // Forbid an access to the default group admin pages.
  public function groupAccess(Route $route, RouteMatchInterface $route_match, AccountInterface $account) {
    return AccessResultAllowed::allowedIf($account->hasPermission('administer group'));
  }

  /**
   * {@inheritdoc}
   */
  public function alterRoutes(RouteCollection $collection) {

    // Forbid an access to the default group admin pages.
    foreach ($collection->all() as $routename => $route) {
      $gnodes = substr($route->getPath(), 0, 19) == '/group/{group}/node';
      $gmembers = substr($route->getPath(), 0, 22) == '/group/{group}/members';
      $gcontent = substr($route->getPath(), 0, 22) == '/group/{group}/content';

      if ($gnodes || $gmembers || $gcontent) {
        $route->setRequirement(
          '_custom_access',
          '\Drupal\anu_content_administration\Routing\AdminRouteSubscriber::groupAccess'
        );
      }
    }
  }
}
