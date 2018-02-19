<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Assigns a chosen group to a user.
 *
 * @Action(
 *   id = "anu_assign_group",
 *   label = @Translation("Assign group to user"),
 *   type = "user",
 *   requirements = {
 *     "_permission" = "administer group",
 *   },
 * )
 */
class AssignGroup extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $group = \Drupal::entityTypeManager()->getStorage('group')->load(5);
    $group->addContent($entity, 'group_membership');
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
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  public function buildConfigurationForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {

    $groups = \Drupal::entityTypeManager()->getStorage('group')->loadMultiple();

    $group_list = [];
    foreach ($groups as $group) {
      $group_list[$group->id()] = $group->label();
    }

    $form['setting_group'] = [
      '#title' => t('Choose the group name'),
      '#type' => 'select',
      '#options' => $group_list,
      '#default_value' => $form_state->getValue('setting_group'),
    ];

    return $form;
  }

}
