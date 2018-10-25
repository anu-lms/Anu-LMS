<?php

namespace Drupal\anu_search\Plugin\search_api\processor;

use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Processor\ProcessorProperty;
use Drupal\search_api\Processor\ProcessorPluginBase;
use Drupal\search_api\Datasource\DatasourceInterface;

/**
 * Adds the resource's Organization to the indexed data.
 *
 * @SearchApiProcessor(
 *   id = "anu_resource_organization",
 *   label = @Translation("Resource Organization"),
 *   description = @Translation("Adds the resource's Organization to the indexed data."),
 *   stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = true,
 * )
 */
class ResourceOrganization extends ProcessorPluginBase {

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {
    $properties = [];

    // Add property only to the paragraph entity.
    if ($datasource && $datasource->getEntityTypeId() == 'paragraph') {
      $definition = [
        'label' => $this->t('Organization'),
        'description' => $this->t('An organization of the resource.'),
        'type' => 'integer',
        'processor_id' => $this->getPluginId(),
        'is_list' => TRUE,
      ];
      $properties['anu_resource_organization'] = new ProcessorProperty($definition);
    }

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function addFieldValues(ItemInterface $item) {
    $org_ids = [];
    try {
      // Get the node object.
      $lesson = $item->getOriginalObject()->getValue()->getParentEntity();
      if (!$lesson) {
        // Apparently we were active for a wrong item.
        return;
      }

      // Prepares list of course's organizations.
      $courses = $lesson->get('field_lesson_course')->referencedEntities();
      foreach ($courses as $course) {
        $orgs = array_map('intval', array_column($course->field_course_organisation->getValue(), 'target_id'));
        foreach ($orgs as $org) {
          if (!in_array($org, $org_ids)) {
            $org_ids[] = $org;
          }
        }
      }

      if (empty($org_ids)) {
        return;
      }

      // Adds organization values to the filter.
      $fields = $this->getFieldsHelper()
        ->filterForPropertyPath($item->getFields(), $item->getDatasourceId(), 'anu_resource_organization');
      foreach ($fields as $field) {
        foreach ($org_ids as $org_id) {
          $field->addValue($org_id);
        }
      }
    }
    catch (\Exception $exception) {
      $this->logException($exception);
    }
  }

}
