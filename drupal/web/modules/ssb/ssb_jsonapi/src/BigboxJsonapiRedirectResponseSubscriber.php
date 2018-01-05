<?php

namespace Drupal\ssb_jsonapi;

use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\EventSubscriber\RedirectResponseSubscriber;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Component\HttpFoundation\SecuredRedirectResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SsbJsonapiRedirectResponseSubscriber
 * Переопределение метода класса родителя
 * 
 * @package Drupal\ssb_jsonapi
 */
class SsbJsonapiRedirectResponseSubscriber extends RedirectResponseSubscriber{
  
  /**
   * Code copied from the original class.
   *
   * @param FilterResponseEvent $event
   */
  public function checkRedirectUrl(FilterResponseEvent $event) {
    $response = $event->getResponse();
    if ($response instanceof RedirectResponse) {
      $request = $event->getRequest();
      
      // Let the 'destination' query parameter override the redirect target.
      // If $response is already a SecuredRedirectResponse, it might reject the
      // new target as invalid, in which case proceed with the old target.
      $destination = $request->query->get('destination');
      if ($destination) {
        // The 'Location' HTTP header must always be absolute.
        $destination = $this->getDestinationAsAbsoluteUrl($destination, $request->getSchemeAndHttpHost());
        try {
          $response->setTargetUrl($destination);
        }
        catch (\InvalidArgumentException $e) {
        }
      }
      
      // Regardless of whether the target is the original one or the overridden
      // destination, ensure that all redirects are safe.
      if (!($response instanceof SecuredRedirectResponse)) {
        try {
          // SecuredRedirectResponse is an abstract class that requires a
          // concrete implementation. Default to LocalRedirectResponse, which
          // considers only redirects to within the same site as safe.
          //$safe_response = LocalRedirectResponse::createFromRedirectResponse($response);      -- закоментировали
          
          // Create TrustedRedirectResponse and return it back.
          $safe_response = new TrustedRedirectResponse($response->getTargetUrl());           // -- добавили
          $safe_response->setRequestContext($this->requestContext);
        }
        catch (\InvalidArgumentException $e) {
          // If the above failed, it's because the redirect target wasn't
          // local. Do not follow that redirect. Display an error message
          // instead. We're already catching one exception, so trigger_error()
          // rather than throw another one.
          // We don't throw an exception, because this is a client error rather than a
          // server error.
          $message = 'Redirects to external URLs are not allowed by default, use \Drupal\Core\Routing\TrustedRedirectResponse for it.';
          trigger_error($message, E_USER_ERROR);
          $safe_response = new Response($message, 400);
        }
        $event->setResponse($safe_response);
      }
    }
  }
  
}
