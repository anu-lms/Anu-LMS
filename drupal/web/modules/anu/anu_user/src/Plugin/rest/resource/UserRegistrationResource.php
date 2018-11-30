<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\user\UserStorageInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\anu_normalizer\AnuNormalizerBase;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to validate reset password link and reset password.
 *
 * @RestResource(
 *   id = "user_register",
 *   label = @Translation("User registration"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/user/registration",
 *   }
 * )
 */
class UserRegistrationResource extends ResourceBase {

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
   * Creates user and add him to defined in token organization and classes.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    try {
      // Retrieve organization from the token.
      $organization = \Drupal::service('anu_organization.organization')->getOrganizationFromToken($data['token']);
      if (empty($organization)) {
        throw new HttpException(406, $this->t('Registration link is not valid. Please contact site administrator.'));
      }

      // Check if organization has not reached the limit.
      $limit = (int) $organization->field_organization_limit->getString();
      $amount = \Drupal::service('anu_organization.organization')->getRegisteredUsersAmount($organization->id());
      if ($amount >= $limit) {
        throw new HttpException(406, $this->t('Organization has reached limit of users. Please contact site administrator.'));
      }

      // Check if email exists.
      $email_taken = (bool) \Drupal::entityQuery('user')
        ->condition('mail', $data['email'])
        ->range(0, 1)
        ->count()
        ->execute();
      if ($email_taken) {
        return new ModifiedResourceResponse([
          'error_type' => 'email_exists',
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
        return new ModifiedResourceResponse([
          'error_type' => 'username_exists',
          'message' => $this->t('The username @name is already taken.', ['@name' => $data['username']]),
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
      $violations = $user->validate();
      if (count($violations) > 0) {
        throw new HttpException(406, $violations->get(0)->getMessage());
      }

      // Save the entity.
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

      return new ModifiedResourceResponse(AnuNormalizerBase::normalizeEntity($user), 200);
    }
    catch (\Exception $e) {
      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = $this->t('Could not register a user.');
      }
      $this->logger->critical($message);
      return new ModifiedResourceResponse([
        'error_type' => 'validation',
        'message' => $message,
      ], 406);
    }
  }

}
