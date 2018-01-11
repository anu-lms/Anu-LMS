<?php

namespace Drupal\ssb_routes;

use Drupal\Core\Url;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class UserEditRedirectSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    // This announces which events you want to subscribe to.
    // We only need the request event for this example.  Pass
    // this an array of method names
    return([
      KernelEvents::REQUEST => [
        ['redirectNodeView'],
      ]
    ]);
  }

  /**
   * Redirect requests for user edit pages to user page.
   *
   * @param GetResponseEvent $event
   * @return void
   */
  public function redirectNodeView(GetResponseEvent $event) {
    $request = $event->getRequest();

    // This is necessary because this also gets called on
    // node sub-tabs such as "edit", "revisions", etc.  This
    // prevents those pages from redirected.
    if ($request->attributes->get('_route') !== 'entity.user.canonical') {
      return;
    }

    $account = $request->attributes->get('user');

    $path = \Drupal\Core\Url::fromRoute('entity.user.edit_form', ['user' => $account->id()]);
    $response = new RedirectResponse($path->toString());
    $event->setResponse($response);
  }

}
