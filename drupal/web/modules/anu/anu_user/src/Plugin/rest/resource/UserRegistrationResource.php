<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\user\UserStorageInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\anu_normalizer\AnuNormalizerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\rest\Plugin\rest\resource\EntityResourceValidationTrait;

/**
 * Provides a resource to validate reset password link and reset password.
 *
 * @RestResource(
 *   id = "user_registration",
 *   label = @Translation("User registration"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/user/register/register",
 *   }
 * )
 */
class UserRegistrationResource extends ResourceBase {
  use EntityResourceValidationTrait;

  /**
   * Constructs a new UserRegistrationResource instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\user\UserStorageInterface $user_storage
   *   User storage.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, UserStorageInterface $user_storage) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->userStorage = $user_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('anu_user'),
      $container->get('entity.manager')->getStorage('user')
    );
  }

  /**
   * Responds to POST requests.
   *
   *
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    try {
      // Retrieve organization from the token.
      $organization = \Drupal::service('anu_organization.organization')->getOrganizationFromToken($data['token']);
      if (empty($organization)) {
        return new ResourceResponse([
          'message' => $this->t('Registration link is not valid. Please contact site administrator.'),
        ], 406);
      }

      // Check if organization has not reached the limit.
      $limit = (int) $organization->field_organization_limit->getString();
      $amount = \Drupal::service('anu_organization.organization')->getRegisteredUsersAmount($organization->id());
      if ($amount >= $limit) {
        return new ResourceResponse([
          'message' => $this->t('Organization has reached limit of users. Please contact site administrator.'),
        ], 406);
      }

      // Check if email exists.
      $email_taken = (bool) \Drupal::entityQuery('user')
        ->condition('mail', $data['email'])
        ->range(0, 1)
        ->count()
        ->execute();
      if ($email_taken) {
        return new ResourceResponse([
          'message' => $this->t('The email is already taken.'),
        ], 406);
      }

      // Check if username exists.
      $username_taken = (bool) \Drupal::entityQuery('user')
        ->condition('name', $data['username'])
        ->range(0, 1)
        ->count()
        ->execute();
      if ($username_taken) {
        return new ResourceResponse([
          'message' => $this->t('The username is already taken.'),
        ], 406);
      }

      // Create a new user.
      $user = $this->userStorage
        ->create([
          'name' => $data['username'],
          'mail' => $data['email'],
          'pass' => $data['password'],
          'status' => 1,
          'field_first_name' => $data['firstName'],
          'field_last_name' => $data['lastName'],
          'field_organization' => $organization->id(),
        ]);
      $user->enforceIsNew();

      // Make sure that the user entity is valid (email and name are valid).
      $this->validate($user);

      $user->save();

      // Add user to classes.
      $group_ids = \Drupal::entityQuery('group')
        ->condition('field_organization', $organization->id())
        ->execute();
      if ($group_ids) {
        $groups = \Drupal::entityTypeManager()
          ->getStorage('group')
          ->loadMultiple($group_ids);

        foreach ($groups as $group) {
          $group->addMember($user);
        }
      }

      // Return registered user.
      return new ResourceResponse(AnuNormalizerBase::normalizeEntity($user), 200);
    }
    catch (\Exception $e) {
      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = $this->t('Could not register a user.');
      }
      $this->logger->critical($message);
      return new ResourceResponse([
        'message' => $message,
      ], 406);
    }
  }

}
