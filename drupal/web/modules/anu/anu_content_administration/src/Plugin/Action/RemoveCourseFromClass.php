<?php

namespace Drupal\anu_content_administration\Plugin\Action;

use Drupal\Core\Form\FormStateInterface;
use Drupal\group\Entity\GroupContent;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;

/**
 * Remove chosen courses from classes.
 *
 * @Action(
 *   id = "anu_remove_course_from_class",
 *   label = @Translation("Remove chosen courses from classes"),
 *   type = "node",
 *   requirements = {
 *     "_permission" = "add content to class",
 *   },
 * )
 */
class RemoveCourseFromClass extends ViewsBulkOperationsActionBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function execute($entity = NULL) {
    if ($group_contents = GroupContent::loadByEntity($entity)) {
      /** @var \Drupal\group\Entity\GroupContent $group_content */
      foreach ($group_contents as $group_content) {
        if (in_array($group_content->getGroup()->id(), $this->configuration['classes'])) {
          $group_content->delete();
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function access($entity, AccountInterface $account = NULL, $return_as_object = FALSE) {
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
    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple();

    $group_list = [];
    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      if ($group->access('view')) {
        $group_list[$group->id()] = $group->label();
      }
    }

    $form['classes'] = [
      '#title' => t('Choose the Classes to remove from the selected courses:'),
      '#type' => 'checkboxes',
      '#options' => $group_list,
    ];

    return $form;
  }

}
