<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Remove chosen groups from the users.
 *
 * @Action(
 *   id = "anu_remove_group",
 *   label = @Translation("Remove Classes from the selected users"),
 *   type = "user",
 *   requirements = {
 *     "_permission" = "add members to class",
 *   },
 * )
 */
class RemoveGroup extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {

    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple($this->configuration['classes']);

    foreach ($groups as $group) {
      $group->removeMember($entity);
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
      if (!$group->access('delete')) {
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
      if ($group->access('delete')) {
        $group_list[$group->id()] = $group->label();
      }
    }

    $form['classes'] = [
      '#title' => t('Choose the Classes to remove from the selected users:'),
      '#type' => 'checkboxes',
      '#options' => $group_list,
    ];

    return $form;
  }

}
