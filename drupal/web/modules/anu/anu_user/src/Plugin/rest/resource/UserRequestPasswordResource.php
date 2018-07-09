<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\user\UserInterface;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to send Password reset email to the user.
 *
 * @RestResource(
 *   id = "user_request_password",
 *   label = @Translation("User Request Password"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/user/password/request",
 *   }
 * )
 */
class UserRequestPasswordResource extends ResourceBase {

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
   * @param \Drupal\user\UserInterface $user_storage
   *   User storage.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, UserInterface $user_storage) {
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
   * Send Password reset email to the user.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    if (empty($data['username'])) {
      return new ResourceResponse([
        'message' => $this->t('Username is not recognized as a username or an email address.'),
      ], 406);
    }

    // Load by name if provided.
    $users = $this->userStorage->loadByProperties(['name' => trim($data['username'])]);
    if (empty($users)) {
      $users = $this->userStorage->loadByProperties(['mail' => trim($data['username'])]);
    }

    /** @var \Drupal\Core\Session\AccountInterface $account */
    $account = reset($users);
    if ($account && $account->id()) {
      if (user_is_blocked($account->getAccountName())) {
        return new ResourceResponse([
          'message' => $this->t('The user has not been activated or is blocked.'),
        ], 406);
      }

      // Send the password reset email.
      $mail = _user_mail_notify('password_reset', $account, $account->getPreferredLangcode());
      if (empty($mail)) {
        $message = $this->t('Unable to send email. Contact the site administrator if the problem persists.');
        $this->logger->error($message);
        return new ResourceResponse(['message' => $message], 406);
      }
      else {
        $this->logger->notice('Password reset instructions mailed to %name at %email.', ['%name' => $account->getAccountName(), '%email' => $account->getEmail()]);
        return new ResourceResponse(['email' => $account->getEmail()]);
      }
    }
    else {
      return new ResourceResponse([
        'message' => $this->t('@username is not recognized as a username or an email address.', ['@username' => $data['username']]),
      ], 406);
    }
  }

}
