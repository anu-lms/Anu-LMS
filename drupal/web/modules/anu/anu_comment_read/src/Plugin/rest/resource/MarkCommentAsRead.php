<?php

namespace Drupal\anu_comment_read\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\Core\Entity\EntityStorageInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to mark comment as read.
 *
 * @RestResource(
 *   id = "mark_comment_as_read",
 *   label = @Translation("Mark comments as read"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/comments/mark-as-read",
 *   }
 * )
 */
class MarkCommentAsRead extends ResourceBase {

  /**
   * Constructs a new MarkCommentAsRead object.
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
   * @param \Drupal\Core\Entity\EntityStorageInterface $comment_read_storage
   *   Comment read storage.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    EntityStorageInterface $comment_read_storage) {

    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->commentReadStorage = $comment_read_storage;
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
      $container->get('logger.factory')->get('anu_comment_read'),
      $container->get('entity.manager')->getStorage('paragraph_comment_read')
    );
  }

  /**
   * Responds to POST requests.
   *
   * Mark given comments as read by current user.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    if (empty($data['comment_ids'])) {
      return new ResourceResponse([], 200);
    }

    try {
      $comment_ids = $data['comment_ids'];
      $current_user_id = \Drupal::currentUser()->id();
      foreach ($comment_ids as $comment_id) {
        // Check if comment read entity exists.
        $existing_entity = \Drupal::entityQuery('paragraph_comment_read')
          ->condition('uid', $current_user_id)
          ->condition('field_comment', $comment_id)
          ->range(0, 1)
          ->execute();

        // Create a new entity only if not exists.
        if (empty($existing_entity)) {

          $entity = $this->commentReadStorage->create([
            'type' => 'paragraph_comment_read',
            'uid' => $current_user_id,
            'field_comment' => $comment_id,
          ]);
          $entity->save();
        }
      }
    }
    catch (\Exception $e) {

      // Log an error.
      $message = $this->t('Could not mark comments as read.');
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    return new ResourceResponse($comment_ids, 200);
  }

}
