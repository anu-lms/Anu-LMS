<?php

namespace Drupal\anu_courses\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Remove a chosen courses from organizations.
 *
 * @Action(
 *   id = "anu_course_remove_from_organization",
 *   label = @Translation("Remove from Organizations"),
 *   type = "node",
 *   requirements = {
 *     "_permission" = "manage any organization",
 *   },
 * )
 */
class RemoveOrganization extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $organization_ids = array_column($entity->field_course_organisation->getValue(), 'target_id');
    // Removes ids of config orgs from array $organization_ids.
    $new_ids = array_diff($organization_ids, $this->configuration['organization']);

    if (count($organization_ids) != count($new_ids)) {
      $entity->field_course_organisation = $new_ids;
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
