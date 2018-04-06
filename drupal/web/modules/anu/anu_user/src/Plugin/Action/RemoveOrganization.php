<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Remove organization from a selected users.
 *
 * @Action(
 *   id = "anu_remove_organization",
 *   label = @Translation("Remove organization from selected users"),
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
    $entity->field_organization->target_id = null;
    $entity->save();
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
  public function buildConfigurationForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    return $form;
  }

}
