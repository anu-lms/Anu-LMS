<?php

namespace Drupal\anu_user;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Access\CsrfRequestHeaderAccessCheck as CsrfRequestHeaderAccessCheckBase;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Access protection against CSRF attacks.
 */
class CsrfRequestHeaderAccessCheck extends CsrfRequestHeaderAccessCheckBase {

  /**
   * Original class adds Csrf validation for any POST, PATCH etc. requests.
   *
   * That validation is based on session.
   * On frontend we don't use sessions authorisation, so it should be skipped by default.
   *
   * But if user logged in on Drupal backend via /admin/ it will save Session value in browser cookie,
   * so even if we don't use sessions on frontend it will validate it because cookies contain session value.
   *
   * We add an additional condition to limit validation by requests from backend only.
   */
  public function access(Request $request, AccountInterface $account) {
    $method = $request->getMethod();
    $is_frontend_request = FALSE;

    $referer = $request->headers->get('referer');
    if (!empty($referer)) {
      $referer_parsed = parse_url($referer);
      $same_host = $referer_parsed['host'] == $request->getHost();
      $is_frontend = !empty($referer_parsed['path']) && substr($referer_parsed['path'], 0, 6) !== '/admin';
      if ($same_host && $is_frontend) {
        $is_frontend_request = TRUE;
      }
    }

    // Based on original CsrfRequestHeaderAccessCheck->access() method,
    // but validation should work only for requests from backend.
    if (!$is_frontend_request
      && !in_array($method, ['GET', 'HEAD', 'OPTIONS', 'TRACE'])
      && $account->isAuthenticated()
      && $this->sessionConfiguration->hasSession($request)
    ) {
      return parent::access($request, $account);
    }

    // Let other access checkers decide if the request is legit.
    return AccessResult::allowed()->setCacheMaxAge(0);
  }

}
