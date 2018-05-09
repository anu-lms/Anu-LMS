<?php

namespace Drupal\anu_events\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to load notifications of the current user.
 *
 * @RestResource(
 *   id = "user_notifications",
 *   label = @Translation("User Notifications"),
 *   uri_paths = {
 *     "canonical" = "/notifications"
 *   }
 * )
 */
class UserNotifications extends ResourceBase {

  /**
   * Constructs a new UserNotifications object.
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
   *   A current user instance.
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
      $container->get('logger.factory')->get('anu_events')
    );
  }

  /**
   * Return list of notifications for the current user.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $response = [];
    try {
      $query = \Drupal::entityQuery('message')
        ->condition('field_message_recipient', \Drupal::currentUser()->id())
        ->range(0, 10) // Will be enhanced with lazy loading.
        ->sort('created' , 'DESC');

      $entity_ids = $query->execute();
      $messages = \Drupal::entityTypeManager()
        ->getStorage('message')
        ->loadMultiple($entity_ids);

      foreach ($messages as $message) {
        /* @var $messageService \Drupal\anu_events\Message */
        $messageService = \Drupal::service('anu_events.message');
        $message_item = $messageService->normalize($message);
        if (!empty($message_item)) {
          $response[] = $message_item;
        }
      }
    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not load notifications for the user. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
      return new ResourceResponse(['message' => $message], 406);
    }

    return !empty($response) ? new ResourceResponse(array_values($response)) : new ResourceResponse();
  }
}
