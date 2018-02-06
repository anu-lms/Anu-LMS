<?php

namespace Drupal\anu_quizzes\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "quizzes_results",
 *   label = @Translation("Quizzes Results"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/quizzes/results",
 *   }
 * )
 */
class QuizzesResultsResource extends ResourceBase {

  /**
   * Constructs a new QuizzesResultsResource object.
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
      $container->get('logger.factory')->get('anu_quizzes')
    );
  }

  /**
   * Default values of the data submission.
   *
   * @var array
   */
  protected $defaults = [
    'lessonId' => 0,
    'quizzes' => [],
  ];

  /**
   * Responds to POST requests.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    // Make sure all necessary fields are there.
    $data = array_replace_recursive($this->defaults, $data);

    //$this->logger->debug(print_r($data, 1));

    try {

      // TODO: Check that lesson exists.

      // TODO: Check that all quizzes belong to lesson.

      // TODO: Save results to ECK entities.

    } catch(\Exception $e) {
      // Log an error.
      $message = new FormattableMarkup('Could not submit quizzes.', []);
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    $response = new ResourceResponse(true);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

}
