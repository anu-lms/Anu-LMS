<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Psr\Log\LoggerInterface;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "registration_token_validate",
 *   label = @Translation("Registration token validate"),
 *   uri_paths = {
 *     "canonical" = "/user/register/validate/{token}"
 *   }
 * )
 */
class RegistrationTokenValidate extends ResourceBase {

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
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
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger) {
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
   *
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get($token) {
    $organization = \Drupal::service('anu_organization.organization')->getOrganizationFromToken($token);

    if ($organization) {
      return new ResourceResponse([
        'token' => $token,
        'isValid' => true,
        'errorMessage' => '',
      ]);
    }


    return new ResourceResponse([
      'token' => $token,
      'isValid' => false,
      'errorMessage' => 'Organization has reached limit of users.',
    ]);
  }

}
