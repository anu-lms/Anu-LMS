<?php

namespace Drupal\anu_organization\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\views\ResultRow;

/**
 * Outputs information about registered users and limit for organization
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("anu_limit_info")
 */
class LimitInfo extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $output = '';
    $organization = $values->_entity;

    try {
      $output = 'Limit info for ' . $organization->id();
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not generate onboarding link for organization @id. Error: @error', [
        '@id' => $organization->id(),
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_organization')->error($message);
    }

    return $output;
  }

}
