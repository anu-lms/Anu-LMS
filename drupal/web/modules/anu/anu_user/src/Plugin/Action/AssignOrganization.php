<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Assigns a chosen organizations to a user.
 *
 * @Action(
 *   id = "anu_assign_organization",
 *   label = @Translation("Assign Organizations to the selected users"),
 *   type = "user",
 *   requirements = {
 *     "_permission" = "manage users from any organization",
 *   },
 * )
 */
class AssignOrganization extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $need_save = FALSE;
    $organization_ids = array_column($entity->field_organization->getValue(), 'target_id');

    foreach ($this->configuration['organization'] as $new_id) {
      if ($new_id > 0 && !in_array($new_id, $organization_ids)) {
        $organization_ids[] = $new_id;
        $need_save = TRUE;
      }
    }

    if ($need_save) {
      $entity->field_organization = $organization_ids;
      $entity->save();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function access($object, AccountInterface $account = NULL, $return_as_object = FALSE) {
    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['organization'] = [
      '#title' => t('Choose organizations'),
      '#type' => 'checkboxes',
      '#options' => \Drupal::service('anu_user.user')->getAllowedOrganizationsList(),
    ];

    return $form;
  }

}
