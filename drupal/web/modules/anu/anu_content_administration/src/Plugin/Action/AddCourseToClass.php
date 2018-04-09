<?php

namespace Drupal\anu_content_administration\Plugin\Action;

use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Add a chosen course to classes.
 *
 * @Action(
 *   id = "anu_add_course_to_class",
 *   label = @Translation("Add Course to Class"),
 *   type = "node",
 *   requirements = {
 *     "_permission" = "administer content",
 *   },
 * )
 */
class AddCourseToClass extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple($this->configuration['setting_group']);

    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      if (!$group->getContentByEntityId('group_node:course', $entity->id())) {
        $group->addContent($entity, 'group_node:course');
      }
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
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  public function buildConfigurationForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {

    $groups = \Drupal::entityTypeManager()->getStorage('group')->loadMultiple();

    $group_list = [];
    foreach ($groups as $group) {
      $group_list[$group->id()] = $group->label();
    }

    $form['setting_group'] = [
      '#title' => t('Choose the Classes to assign to the selected courses'),
      '#type' => 'checkboxes',
      '#options' => $group_list,
    ];

    return $form;
  }

}
