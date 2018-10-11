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
      // Add course to the choosen class.
      if (!$group->getContentByEntityId('group_node:course', $entity->id())) {
        $group->addContent($entity, 'group_node:course');
      }

      // Collect organizations of all groups to add course to the same orgs.
      if (!empty($group->field_organization->getValue())) {
        $ids = array_column($group->field_organization->getValue(), 'target_id');
        // Make sure we don't add same organizations twise.
        $group_intersect = array_intersect($ids, $group_org_ids);
        if (empty($group_intersect)) {
          $group_org_ids = array_merge($group_org_ids, array_column($group->field_organization->getValue(), 'target_id'));
        }
      }
    }

    $course_org_ids = [];
    // Get organization ids from given course.
    if (!empty($entity->field_course_organisation->getValue())) {
      $course_org_ids = array_column($entity->field_course_organisation->getValue(), 'target_id');
    }

    // Add course to the same organizations as Class.
    $intersect = array_intersect($course_org_ids, $group_org_ids);
    if (empty($intersect)) {
      $entity->field_course_organisation = array_merge($course_org_ids, $group_org_ids);
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
