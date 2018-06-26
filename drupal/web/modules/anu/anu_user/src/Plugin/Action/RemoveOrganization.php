<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Remove organizations from a selected users.
 *
 * @Action(
 *   id = "anu_remove_organization",
 *   label = @Translation("Remove Organizations from the selected users"),
 *   type = "user",
 *   requirements = {
 *     "_permission" = "administer users",
 *   },
 * )
 */
class RemoveOrganization extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $organization_ids = array_column($entity->field_organization->getValue(), 'target_id');
    // Removes ids of config orgs from array $organization_ids.
    $new_ids = array_diff($organization_ids, $this->configuration['organization']);

    if (count($organization_ids) != count($new_ids)) {
      $entity->field_organization = $new_ids;
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
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *
   * @return array
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $organizations = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'vid' => 'organisations',
      ]);

    $organization_list = [];
    foreach ($organizations as $organization) {
      if ($organization->access('view')) {
        $organization_list[$organization->id()] = $organization->label();
      }
    }

    $form['organization'] = [
      '#title' => t('Choose the organization'),
      '#type' => 'checkboxes',
      '#options' => $organization_list,
    ];

    return $form;
  }

}
