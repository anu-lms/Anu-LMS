<?php

namespace Drupal\anu_content_administration\Plugin\Action;

use Drupal\views_bulk_operations\Action\ViewsBulkOperationsActionBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\group\Entity\GroupContent;

/**
 * Remove chosen courses from classes.
 *
 * @Action(
 *   id = "anu_remove_course_from_class",
 *   label = @Translation("Remove chosen courses from classes"),
 *   type = "node",
 *   requirements = {
 *     "_permission" = "administer content",
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
      if (!$group->access('delete')) {
        return FALSE;
      }
    }

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
    $groups = \Drupal::entityTypeManager()
      ->getStorage('group')
      ->loadMultiple();

    $group_list = [];
    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      if ($group->access('delete')) {
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
