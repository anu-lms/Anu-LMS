<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Assigns chosen groups to the selected users.
 *
 * @Action(
 *   id = "anu_assign_group",
 *   label = @Translation("Assign Classes to the selected users"),
 *   type = "user",
 *   requirements = {
 *     "_permission" = "add members to class",
 *   },
 * )
 */
class AssignGroup extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $user_roles = $entity->getRoles(TRUE);

    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple($this->configuration['classes']);

    foreach ($groups as $group) {
      // Assign teacher role inside the class if user is a teacher.
      $values = in_array('teacher', $user_roles) ? ['group_roles' => ['class-admin']] : [];
      $group->addMember($entity, $values);

      // Collect organizations of all groups to add user to the same orgs.
      if (!empty($group->field_organization->getValue())) {
        $group_org_ids[] = $group->field_organization->getString();
      }
    }

    $user_org_ids = [];
    // Get organization ids from given user.
    if (!empty($entity->field_organization->getValue())) {
      $user_org_ids = array_column($entity->field_organization->getValue(), 'target_id');
    }

    // Add user to the same organizations as Class.
    $need_update = FALSE;
    foreach ($group_org_ids as $group_org_id) {
      if (!in_array($group_org_id, $user_org_ids)) {
        $user_org_ids[] = $group_org_id;
        $need_update = TRUE;
      }
    }

    // Update user organizations if needed.
    if ($need_update) {
      $entity->field_organization = $user_org_ids;
      $entity->save();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function access($entity, AccountInterface $account = NULL, $return_as_object = FALSE) {

    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple($this->configuration['classes']);

    foreach ($groups as $group) {
      if (!$group->access('update')) {
        return FALSE;
      }
    }

    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {

    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple();

    $group_list = [];
    foreach ($groups as $group) {
      if ($group->access('update')) {
        $group_list[$group->id()] = $group->label();
      }
    }

    $form['classes'] = [
      '#title' => t('Choose the Classes to assign to the selected users:'),
      '#type' => 'checkboxes',
      '#options' => $group_list,
    ];

    return $form;
  }

}
