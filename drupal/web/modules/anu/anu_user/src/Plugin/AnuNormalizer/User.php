<?php

namespace Drupal\anu_user\Plugin\AnuNormalizer;

use Drupal\anu_normalizer\AnuNormalizerBase;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Provides normalizer for User entity.
 *
 * @AnuNormalizer(
 *   id = "user_normalizer",
 *   title = @Translation("User normalizer"),
 *   description = @Translation("Normalizes user entity"),
 * )
 */
class User extends AnuNormalizerBase {

  /**
   * {@inheritdoc}
   */
  function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'user' && $entity->bundle() == 'user';
  }

  /**
   * {@inheritdoc}
   */
  function normalize($entity, $include_fields) {
    $output = NULL;
    if (!$this->shouldApply($entity)) {
      return $output;
    }

    try {
      $output = [
        'id' => (int) $entity->id(),
        'uuid' => $entity->uuid(),
        'name' => $entity->name->getString(),
        'mail' => $entity->mail->getString(),
        'status' => (bool) $entity->status->getString(),
        'created' => (int) $entity->created->getString(),
        'changed' => (int) $entity->changed->getString(),
        'roles' => $entity->changed->getValue(),
        'fieldFirstName' => $entity->field_first_name->getString(),
        'fieldLastName' => $entity->field_last_name->getString(),
        'fieldOrganization' => [],
      ];

      // Get user's organizations.
      if (!empty($entity->field_organization->getValue())) {
        $organizations = $entity->field_organization;
        foreach ($organizations as $organization_wrapper) {
          $organization = $organization_wrapper->get('entity')->getValue();

          $output['organization'][] = [
            'id' => $organization->id(),
            'name' => $organization->name->getValue(),
          ];
        }
      }

    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not normalize @entity entity. Error: @error', [
        '@entity' => $entity->getEntityTypeId(),
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
    }

    return $output;
  }
}
