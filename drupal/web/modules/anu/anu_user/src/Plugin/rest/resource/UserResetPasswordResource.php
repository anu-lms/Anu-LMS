<?php
namespace Drupal\anu_user\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\Core\Config\ImmutableConfig;
use Drupal\Core\Session\AccountInterface;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Drupal\Component\Utility\Crypt;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "user_reset_password",
 *   label = @Translation("User Reset Password"),
 *   uri_paths = {
 *     "canonical" = "/user/password/reset/{uid}/{timestamp}/{hash}",
 *     "https://www.drupal.org/link-relations/create" = "/user/password/reset",
 *   }
 * )
 */
class UserResetPasswordResource extends ResourceBase {

  /**
   * User settings config instance.
   *
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $userSettings;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

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
   * @param \Drupal\Core\Config\ImmutableConfig $user_settings
   *   A user settings config instance.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, ImmutableConfig $user_settings, AccountInterface $current_user) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->userSettings = $user_settings;
    $this->currentUser = $current_user;
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
      $container->get('config.factory')->get('user.settings'),
      $container->get('current_user')
    );
  }

  /**
   * Responds to POST requests.
   *
   * Creates or updates Quiz results entity by given POST data.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get($uid, $timestamp, $hash) {
    $user_storage = \Drupal::entityManager()->getStorage('user');

    if ($this->isTokenValid($uid, $timestamp, $hash)) {
      /** @var \Drupal\user\UserInterface $user */
      $user = $user_storage->load($uid);

      $response = new ResourceResponse($user, 200);
      return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
    }
    else {
      $message = $this->t('You have tried to use a one-time login link that has expired. Please request a new one using the form below.');
      throw new HttpException(406, $message);
    }
  }

  /**
   * Responds to POST requests.
   *
   * Creates or updates Quiz results entity by given POST data.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    $user_storage = \Drupal::entityManager()->getStorage('user');
    /** @var \Drupal\user\UserInterface $user */
    $user = $user_storage->load($data['uid']);

    if ($this->isTokenValid($data['uid'], $data['timestamp'], $data['hash'])) {
      $this->logger->notice('User %name used one-time login link at time %timestamp.', ['%name' => $user->getDisplayName(), '%timestamp' => $data['timestamp']]);

      $user->setPassword($data['password_new']);
      $user->_skipProtectedUserFieldConstraint = true;
      $user->save();

      $response = new ResourceResponse($user, 200);
      return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
    }
    else {
      $message = $this->t('You have tried to use a one-time login link that has expired. Please request a new one using the form below.');
      throw new HttpException(406, $message);
    }
  }

  private function isTokenValid($uid, $timestamp, $hash) {
    $user_storage = \Drupal::entityManager()->getStorage('user');
    // The current user is not logged in, so check the parameters.
    $current = REQUEST_TIME;
    /** @var \Drupal\user\UserInterface $user */
    $user = $user_storage->load($uid);

    // Verify that the user exists and is active.
    if ($user === NULL || !$user->isActive()) {
      // Blocked or invalid user ID, so deny access. The parameters will be in
      // the watchdog's URL for the administrator to check.
      return FALSE;
    }

    // Time out, in seconds, until login URL expires.
    $timeout = \Drupal::config('user.settings')->get('password_reset_timeout');
    // No time out for first time login.
    if ($user->getLastLoginTime() && $current - $timestamp > $timeout) {
      return FALSE;
    }
    elseif ($user->isAuthenticated() && ($timestamp >= $user->getLastLoginTime()) && ($timestamp <= $current) && Crypt::hashEquals($hash, user_pass_rehash($user, $timestamp))) {
      return TRUE;
    }

    return FALSE;
  }
}
