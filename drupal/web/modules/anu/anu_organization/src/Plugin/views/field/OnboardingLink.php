<?php

namespace Drupal\anu_organization\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\views\ResultRow;

/**
 * Outputs onboarding link.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("anu_onboarding_link")
 */
class OnboardingLink extends FieldPluginBase {

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
    $output = [];
    $organization = $values->_entity;
    try {
      // Wrap onboarding link to the clipboardjs.
      $output = [
        '#theme' => 'clipboardjs',
        '#alert_text' => t('The link has been copied into the clipboard.'),
        '#text' => \Drupal::service('anu_organization.organization')->getOnboardingLink($organization),
      ];
      $output['#attached']['library'][] = 'anu_organization/onboarding-link';
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
