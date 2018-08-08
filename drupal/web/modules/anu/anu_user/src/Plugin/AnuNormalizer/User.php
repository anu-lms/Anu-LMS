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
  public function shouldApply($entity) {

    return $entity->getEntityTypeId() == 'user' && $entity->bundle() == 'user';
  }

  /**
   * {@inheritdoc}
   */
  public function normalize($entity, $include_fields = [
    'uuid', 'mail', 'status', 'created', 'changed',
  ]) {
    $output = NULL;
    if (!$this->shouldApply($entity)) {
      return $output;
    }

    try {
      $output = [
        'uid' => (int) $entity->id(),
        'name' => $entity->name->getString(),
        'fieldFirstName' => $entity->field_first_name->getString(),
        'fieldLastName' => $entity->field_last_name->getString(),
        'fieldOrganization' => [],
      ];

      if (in_array('uuid', $include_fields)) {
        $output['uuid'] = $entity->uuid();
      }
      if (in_array('mail', $include_fields)) {
        $output['mail'] = $entity->mail->getString();
      }
      if (in_array('status', $include_fields)) {
        $output['status'] = (bool) $entity->status->getString();
      }
      if (in_array('created', $include_fields)) {
        $output['created'] = (int) $entity->created->getString();
      }
      if (in_array('changed', $include_fields)) {
        $output['changed'] = (int) $entity->changed->getString();
      }

      // Get user's organizations.
      if ($entity->hasField('field_organization')) {
        $organizations = $entity->field_organization->referencedEntities();
        foreach ($organizations as $organization) {
          /** @var \Drupal\taxonomy\TermInterface $organization */
          $output['fieldOrganization'][] = [
            'id' => (int) $organization->id(),
            'name' => $organization->getName(),
          ];
        }
      }

    }
    catch (\Exception $e) {
      $message = new FormattableMarkup('Could not normalize @entity entity. Error: @error', [
        '@entity' => $entity->getEntityTypeId(),
        '@error' => $e->getMessage(),
      ]);
      $this->logger->critical($message);
    }

    return $output;
  }

}
