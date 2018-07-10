<?php

namespace Drupal\anu_comments\Plugin\rest\resource;

use Psr\Log\LoggerInterface;
use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to validate reset password link and reset password.
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
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    $comment_read_storage) {

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
      $container->get('logger.factory')->get('anu_comments'),
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

    try {
      $comment_ids = $data['comment_ids'];

      $entities = \Drupal::entityQuery('paragraph_comment_read')
        ->condition('uid', \Drupal::currentUser()->id())
        ->condition('field_comment', $comment_ids, 'IN');

      foreach ($comment_ids as $comment_id) {

        if (!empty($entities[$comment_id])) {

          $entity = $this->commentReadStorage->create([
              'type' => 'paragraph_comment_read',
              'field_comment' => $comment_id,
            ]
          );
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

    $response = new ResourceResponse($comment_ids, 200);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

}
