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
   * Creates or updates Quiz results entity by given POST data.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    // Make sure all necessary fields are there.
    $data = array_replace_recursive($this->defaults, $data);

    try {
      $quiz_ids = array_keys($data['quizzes']);
      $lesson = \Drupal::entityTypeManager()->getStorage('node')->load($data['lessonId']);
      if (empty($lesson)) {
        throw new \Exception('Wrong lesson id: ' . $data['lessonId']);
      }

      $quizzes = \Drupal::entityTypeManager()->getStorage('paragraph')->loadMultiple($quiz_ids);
      foreach ($quizzes as $quiz) {
        $quiz_id = $quiz->id();
        $raw_type = substr($quiz->bundle(), 5); // One of checkboxes, comboboxes, free_answer or linear_scale.
        $quiz_result_type = 'quiz_result_' . $raw_type;

        // Search for existing quiz result entity.
        $entities = \Drupal::entityTypeManager()->getStorage('quiz_result')->loadByProperties([
          'uid' => \Drupal::currentUser()->id(),
          'type' => $quiz_result_type,
          'field_lesson' => $data['lessonId'],
          'field_question' => $quiz_id
        ]);

        // Create a revision for existing entity or create a new one.
        if (!empty($entities)) {
          $entity = reset($entities);
        }
        else {
          $entity = \Drupal::entityTypeManager()->getStorage('quiz_result')->create([
              'type' => $quiz_result_type,
              'field_lesson' => $data['lessonId'],
            ]
          );
        }

        // Fill Question field.
        $quiz_entity = clone $quiz;
        // Set additional dontSave property, because by default when Quiz result entity saving, it also
        // resaves Quiz referenced in question field. It updates parent_type and parent_id,
        // because new parent is quiz instead of node.
        $quiz_entity->dontSave = TRUE;
        $entity->field_question = $quiz_entity;

        // Fill Answer field. Format of the field depends on Quiz result bundle.
        $answer_value = $data['quizzes'][$quiz_id];
        if ($raw_type == 'checkboxes') {
          // Converts ["key1":1, "key2":0, "key3":1] to ["key1":1, "key3":1].
          // Remove zero values.
          $not_empty_values = array_filter($answer_value);
          $entity->field_options_answer = array_keys($not_empty_values);
        }
        elseif ($raw_type == 'comboboxes') {
          // Converts "val1" to ["val1"].
          $entity->field_options_answer = [$answer_value];
        }
        else {
          // Save other fields as is.
          $answer_field_name = 'field_' . $raw_type . '_answer';
          $entity->{$answer_field_name} = $data['quizzes'][$quiz_id];
        }

        $entity->setNewRevision(TRUE);
        $entity->save();
      }
    } catch(\Exception $e) {
      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = new FormattableMarkup('Could not submit quizzes.', []);
      }
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    $response = new ResourceResponse(true);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

}
