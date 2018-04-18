<?php

/**
 * Class CustomUrlsExtension
 *
 */
class CustomUrlsExtension extends \Codeception\Extension {
  public static $events = array(
    'test.before' => 'beforeTest',
  );

  public function beforeTest(\Codeception\Event\TestEvent $event) {
    $this->setFrontendUrl($event);
  }

  public function setFrontendUrl(\Codeception\Event\TestEvent $event) {
    // Only for WebDriver.
    if (!$this->hasModule('WebDriver')) {
      return;
    }

    // Only if frontend_url config is set.
    if (empty($this->getGlobalConfig()['modules']['config']['WebDriver']['frontend_url'])) {
      return;
    }

    $frontend_url = $this->getGlobalConfig()['modules']['config']['WebDriver']['frontend_url'];

    // Only if current test in frontend group.
    if (!in_array('frontend', $event->getTest()->getMetadata()->getGroups())) {
      return;
    }

    // Set frontend url.
    $this->getModule('WebDriver')->_reconfigure(array('url' => $frontend_url));
  }
}
