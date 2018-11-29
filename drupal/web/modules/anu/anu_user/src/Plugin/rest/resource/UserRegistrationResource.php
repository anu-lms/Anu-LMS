<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\user\UserStorageInterface;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Utility\Crypt;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\anu_normalizer\AnuNormalizerBase;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to validate reset password link and reset password.
 *
 * @RestResource(
 *   id = "user_registration",
 *   label = @Translation("User registration"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/user/register",
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
   *
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    $user = $this->userStorage->load($data['uid']);

    try {

      $user->setPassword($data['password_new']);
      $user->_skipProtectedUserFieldConstraint = TRUE;
      $user->save();
    }
    catch (\Exception $e) {

      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = $this->t('Could not update password.');
      }
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    $response = new ResourceResponse(AnuNormalizerBase::normalizeEntity($user), 200);

//    return new ResourceResponse([
//      'message' => $this->t('Unable to reset password. Contact the site administrator if the problem persists.'),
//    ], 406);
  }

}
