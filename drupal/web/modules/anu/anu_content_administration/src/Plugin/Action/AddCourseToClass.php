<?php

namespace Drupal\anu_content_administration\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;

/**
 * Add a chosen course to classes.
 *
 * @Action(
 *   id = "anu_add_course_to_class",
 *   label = @Translation("Add Course to Class"),
 *   type = "node",
 *   requirements = {
 *     "_permission" = "add content to class",
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
      ->loadMultiple($this->configuration['classes']);

    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      // Add course to the chosen class.
      if (!$group->getContentByEntityId('group_node:course', $entity->id())) {
        $group->addContent($entity, 'group_node:course');
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function access($object, AccountInterface $account = NULL, $return_as_object = FALSE) {
    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple($this->configuration['classes']);

    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      if (!$group->access('view')) {
        return FALSE;
      }
    }

    return TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $groups = \Drupal::entityTypeManager()->getStorage('group')->loadMultiple();

    $group_list = [];
    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      if ($group->access('view')) {
        $group_list[$group->id()] = $group->label();
      }
    }

    $form['classes'] = [
      '#title' => t('Choose the Classes to assign to the selected courses'),
      '#type' => 'checkboxes',
      '#options' => $group_list,
    ];

    return $form;
  }

}
