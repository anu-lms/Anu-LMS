<?php

namespace Drupal\anu_courses\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;

/**
 * Assigns a chosen courses to organizations.
 *
 * @Action(
 *   id = "anu_course_add_to_organization",
 *   label = @Translation("Add to Organizations"),
 *   type = "node",
 *   requirements = {
 *     "_permission" = "manage any organization",
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
    $organization_ids = array_column($entity->field_course_organisation->getValue(), 'target_id');

    // Collect organization ids to add to the course.
    foreach ($this->configuration['organization'] as $new_id) {
      if ($new_id > 0 && !in_array($new_id, $organization_ids)) {
        $organization_ids[] = $new_id;
        $need_save = TRUE;
      }
    }

    if ($need_save) {
      $entity->field_course_organisation = $organization_ids;
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
