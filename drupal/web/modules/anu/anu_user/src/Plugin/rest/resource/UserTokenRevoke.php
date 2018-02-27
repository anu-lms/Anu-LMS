<?php
namespace Drupal\anu_user\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\Core\Config\ImmutableConfig;
use Drupal\Core\Session\AccountInterface;
use Drupal\rest\Plugin\ResourceBase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Remove user tokens.
 *
 * @RestResource(
 *   id = "user_token_revoke",
 *   label = @Translation("User Token Revoke"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/user/token/revoke",
 *   }
 * )
 */
class UserTokenRevoke extends ResourceBase {

  /**
   * Constructs a new UserTokenRevoke instance.
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
   * Remove user tokens.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post() {
    try {
      $current_user = \Drupal::currentUser();
      $collector = \Drupal::service('simple_oauth.expired_collector');

      // Collect the affected tokens and expire them.
      $collector->deleteMultipleTokens($collector->collectForAccount($current_user));
    }
    catch(\Exception $e) {
      $message = $this->t('There is a problem with token revoke.');
      $this->logger->warning($message);
      return new ResourceResponse(['message' => $message], 406);
    }
    return new ResourceResponse(true);
  }
}
