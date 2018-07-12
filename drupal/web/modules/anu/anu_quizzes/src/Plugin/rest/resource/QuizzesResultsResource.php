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
 *     "canonical" = "/quizzes/results/{ids}",
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
        // One of checkboxes, comboboxes, free_answer or linear_scale.
        $raw_type = substr($quiz->bundle(), 5);
        $quiz_result_type = 'quiz_result_' . $raw_type;

        // Search for existing quiz result entity.
        $entities = \Drupal::entityTypeManager()->getStorage('quiz_result')->loadByProperties([
          'uid' => \Drupal::currentUser()->id(),
          'type' => $quiz_result_type,
          'field_lesson' => $data['lessonId'],
          'field_question' => $quiz_id,
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
    }
    catch (\Exception $e) {
      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = new FormattableMarkup('Could not submit quizzes.', []);
      }
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    $response = new ResourceResponse(TRUE);
    return $response->addCacheableDependency(['#cache' => ['max-age' => 0]]);
  }

  /**
   * Returns previously submitted quiz results for the currently logged in user.
   *
   * @param string $ids
   *   Comma-separated list of Quizzes (paragraphs).
   */
  public function get($ids) {
    $results = [];

    // Convert comma-separated list of ids into an array.
    $quiz_ids = explode(',', $ids);

    // Return empty response if there are no quiz ids in the request.
    if (empty($quiz_ids)) {
      return new ResourceResponse($results);
    }

    try {

      // Load previously submitted quiz results for the logged in user.
      $quizz_results = \Drupal::entityTypeManager()
        ->getStorage('quiz_result')
        ->loadByProperties([
          'field_question' => $quiz_ids,
          'uid' => \Drupal::currentUser()->id(),
        ]);

      foreach ($quizz_results as $quiz_result) {

        // Load a list of fields for the quiz results entity.
        $entityManager = \Drupal::service('entity_field.manager');
        $fields = $entityManager->getFieldDefinitions($quiz_result->getEntityTypeId(), $quiz_result->bundle());

        // Searching for a field with "answer" name in the field name. This field
        // stores the result of the quiz.
        $field_name_answer = '';
        foreach ($fields as $field_name => $field) {
          if (strpos($field_name, 'answer')) {
            $field_name_answer = $field_name;
            break;
          }
        }

        if (!empty($field_name_answer) && !empty($field)) {

          // Get field cardinality.
          $cardinality = $field->getFieldStorageDefinition()->getCardinality();

          // Get the whole field value.
          $value = $quiz_result->get($field_name_answer)->getValue();

          // Get referenced quiz ID (paragraph ID).
          $quiz_id = $quiz_result->get('field_question')
            ->first()
            ->getValue()['target_id'];

          // Add the paragraph id to the result array for reference on the FE.
          $results[$quiz_id]['id'] = $quiz_id;

          // If the field cardinality is 1 max, then we send the result as a
          // single value field.
          if ($cardinality == 1) {
            $results[$quiz_id]['value'] = $value[0]['value'];
          }
          // Otherwise set the result value as for options.
          else {
            foreach ($value as $item) {
              $results[$quiz_id]['value'][$item['value']] = 1;
            }
          }
        }
      }
    }
    catch (\Exception $e) {
      // Log an error.
      $message = $e->getMessage();
      if (empty($message)) {
        $message = new FormattableMarkup('Could not return previously submitted quiz results.', []);
      }
      $this->logger->critical($message);
      throw new HttpException(406, $message);
    }

    return new ResourceResponse(array_values($results));
  }

}
