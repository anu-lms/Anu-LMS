<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\user\Entity\User;
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
   * Constructs a new UserResetPasswordResource instance.
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
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
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
      $container->get('logger.factory')->get('anu_user')
    );
  }

  /**
   * Responds to GET requests.
   *
   * Validates reset password link and return user object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get($uid, $timestamp, $hash) {
    if ($this->isTokenValid($uid, $timestamp, $hash)) {
      $user = User::load($uid);

      $response = new ResourceResponse(AnuNormalizerBase::normalizeEntity($user), 200);
      return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
    }
    else {
      return new ResourceResponse([
        'message' => $this->t('You have tried to use a one-time login link that has expired. Please request a new one using the form below.'),
      ], 406);
    }
  }

  /**
   * Responds to POST requests.
   *
   * Validates reset password link and updates user password.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    $user = User::load($data['uid']);

    if ($this->isTokenValid($data['uid'], $data['timestamp'], $data['hash'])) {
      $this->logger->notice('User %name used one-time login link at time %timestamp.', ['%name' => $user->getDisplayName(), '%timestamp' => $data['timestamp']]);
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
      return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
    }
    else {
      return new ResourceResponse([
        'message' => $this->t('Unable to reset password. Contact the site administrator if the problem persists.'),
      ], 406);
    }
  }

  /**
   * Validate token for password reset.
   */
  private function isTokenValid($uid, $timestamp, $hash) {
    // The current user is not logged in, so check the parameters.
    $user = User::load($uid);
    $request_time = \Drupal::time()->getRequestTime();

    // Verify that the user exists and is active.
    if ($user === NULL || !$user->isActive()) {
      // Blocked or invalid user ID, so deny access. The parameters will be in
      // the watchdog's URL for the administrator to check.
      return FALSE;
    }

    // Time out, in seconds, until login URL expires.
    $timeout = \Drupal::config('user.settings')->get('password_reset_timeout');
    // No time out for first time login.
    if ($user->getLastLoginTime() && $request_time - $timestamp > $timeout) {
      return FALSE;
    }
    elseif ($user->isAuthenticated() && ($timestamp >= $user->getLastLoginTime()) && ($timestamp <= $request_time) && Crypt::hashEquals($hash, user_pass_rehash($user, $timestamp))) {
      return TRUE;
    }

    return FALSE;
  }

}
