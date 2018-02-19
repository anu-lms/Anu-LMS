<?php
namespace Drupal\anu_user\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\Core\Config\ImmutableConfig;
use Drupal\Core\Session\AccountInterface;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "user_request_password",
 *   label = @Translation("User Request Password"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/request-reset-password",
 *   }
 * )
 */
class UserRequestPasswordResource extends ResourceBase {

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
  public function post($data) {
    $user_storage = \Drupal::entityManager()->getStorage('user');

    // Load by name if provided.
    if (isset($data['username'])) {
      $users = $user_storage->loadByProperties(['name' => trim($data['username'])]);
    }
    if (empty($users)) {
      $users = $user_storage->loadByProperties(['mail' => trim($data['username'])]);
    }

    /** @var \Drupal\Core\Session\AccountInterface $account */
    $account = reset($users);
    if ($account && $account->id()) {
      if (user_is_blocked($account->getAccountName())) {
        throw new BadRequestHttpException('The user has not been activated or is blocked.');
      }

      // Send the password reset email.
      $mail = _user_mail_notify('password_reset', $account, $account->getPreferredLangcode());
      if (empty($mail)) {
        throw new BadRequestHttpException('Unable to send email. Contact the site administrator if the problem persists.');
      }
      else {
        $this->logger->notice('Password reset instructions mailed to %name at %email.', ['%name' => $account->getAccountName(), '%email' => $account->getEmail()]);
        return new ResourceResponse(['email' => $account->getEmail()]);
      }
    }

    $response = new ResourceResponse($data, 200);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }
}
