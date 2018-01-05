<?php

namespace Drupal\ssb_jsonapi\Normalizer;

use Drupal\ssb_jsonapi\Normalizer\Value\SsbEntityNormalizerValue;
use Drupal\ssb_metatag\Normalizer\MetatagsContentEntityNormalizer;
use Drupal\Core\Cache\RefinableCacheableDependencyInterface;

/**
 * Class NormalizerAddEditPath
 * @package Drupal\ssb_jsonapi\Normalizer
 *
 * Needed to add edit links to the JSON API output.
 */
class NormalizerAddEditPath extends MetatagsContentEntityNormalizer {
  
  /**
   * Нормализация значений сущности
   *
   * @param object $entity
   * @param null $format
   * @param array $context
   * @return SsbEntityNormalizerValue
   */
  function normalize($entity, $format = NULL, array $context = []) {
    $context['resource_type'] = $resource_type = $this->resourceTypeRepository->get(
      $entity->getEntityTypeId(),
      $entity->bundle()
    );
    $resource_type_name = $resource_type->getTypeName();
    // Get the bundle ID of the requested resource. This is used to determine if
    // this is a bundle level resource or an entity level resource.
    $bundle = $resource_type->getBundle();
    if (!empty($context['sparse_fieldset'][$resource_type_name])) {
      $field_names = $context['sparse_fieldset'][$resource_type_name];
    }
    else {
      $field_names = $this->getFieldNames($entity, $bundle, $resource_type);
    }

    $normalizer_values = [];
    foreach ($this->getFields($entity, $bundle, $resource_type) as $field_name => $field) {
      if (!in_array($field_name, $field_names)) {
        continue;
      }
      $normalizer_values[$field_name] = $this->serializeField($field, $context, $format);
    }

    $link_context = ['link_manager' => $this->linkManager];

    $output = new SsbEntityNormalizerValue($normalizer_values, $context, $entity, $link_context);

    // Add the entity level cacheability metadata.
    $output->addCacheableDependency($entity);
    $output->addCacheableDependency($output);
    // Add the field level cacheability metadata.
    array_walk($normalizer_values, function ($normalizer_value) {
      if ($normalizer_value instanceof RefinableCacheableDependencyInterface) {
        $normalizer_value->addCacheableDependency($normalizer_value);
      }
    });
    return $output;
  }
}
