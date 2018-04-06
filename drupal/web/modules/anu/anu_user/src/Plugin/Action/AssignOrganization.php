<?php

namespace Drupal\anu_user\Plugin\Action;

use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Assigns a chosen organization to a user.
 *
 * @Action(
 *   id = "anu_assign_organization",
 *   label = @Translation("Assign organization to selected users"),
 *   type = "user",
 *   requirements = {
 *     "_permission" = "administer users",
 *   },
 * )
 */
class AssignOrganization extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $entity->field_organization->target_id = $this->configuration['organization'];
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
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  public function buildConfigurationForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {

    $organizations = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'vid' => 'organisations',
      ]);

    $organization_list = [];
    foreach ($organizations as $organization) {
      $organization_list[$organization->id()] = $organization->label();
    }

    $form['organization'] = [
      '#title' => t('Choose the organization'),
      '#type' => 'select',
      '#options' => $organization_list,
      '#default_value' => $form_state->getValue('organization'),
    ];

    return $form;
  }

}
