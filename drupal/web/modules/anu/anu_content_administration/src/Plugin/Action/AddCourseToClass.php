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

    $group_org_ids = [];
    /** @var \Drupal\group\Entity\GroupInterface $group */
    foreach ($groups as $group) {
      // Add course to the chosen class.
      if (!$group->getContentByEntityId('group_node:course', $entity->id())) {
        $group->addContent($entity, 'group_node:course');
      }

      // Collect organizations of all groups to add course to the same orgs.
      if (!empty($group->field_organization->getValue())) {
        $group_org_ids[] = $group->field_organization->getString();
      }
    }

    $course_org_ids = [];
    // Get organization ids from given course.
    if (!empty($entity->field_course_organisation->getValue())) {
      $course_org_ids = array_column($entity->field_course_organisation->getValue(), 'target_id');
    }

    // Add course to the same organizations as Class.
    $need_update = FALSE;
    foreach ($group_org_ids as $group_org_id) {
      if (!in_array($group_org_id, $course_org_ids)) {
        $course_org_ids[] = $group_org_id;
        $need_update = TRUE;
      }
    }

    // Update course organizations if needed.
    if ($need_update) {
      $entity->field_course_organisation = $course_org_ids;
      $entity->save();
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
