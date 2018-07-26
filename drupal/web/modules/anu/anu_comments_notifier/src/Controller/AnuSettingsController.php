<?php

namespace Drupal\anu_comments_notifier\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Main Anu configuration page.
 */
class AnuSettingsController extends ControllerBase {

  /**
   * Shows menu description.
   */
  public function description() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Anu settings'),
    ];
  }

}
