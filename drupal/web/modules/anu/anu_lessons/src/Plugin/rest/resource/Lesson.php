<?php

namespace Drupal\anu_lessons\Plugin\rest\resource;

use Drupal\anu_courses\Course;
use Drupal\Core\Path\AliasManagerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\Entity\Node;
use Drupal\paragraphs\ParagraphInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Drupal\Core\GeneratedUrl;

/**
 * Provides a lesson with its data.
 *
 * @RestResource(
 *   id = "lesson",
 *   label = @Translation("Lesson data"),
 *   uri_paths = {
 *     "canonical" = "/lesson"
 *   }
 * )
 */
class Lesson extends ResourceBase {

  /**
   *  A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   *
   * A current request object.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $currentRequest;

  /**
   * Path alias manager service object.
   *
   * @var \Drupal\Core\Path\AliasManagerInterface
   */
  protected $aliasManager;

  /**
   * Course helper class.
   *
   * @var \Drupal\anu_courses\Course
   */
  protected $courseManager;

  /**
   * Internal counter for numbered divider paragraph.
   */
  protected static $dividedCounter = 1;

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
   * @param \Drupal\Core\Session\AccountProxyInterface $current_user
   *   The current user instance.
   * @param \Symfony\Component\HttpFoundation\Request $current_request
   *   The current request
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, AccountProxyInterface $current_user, Request $current_request, AliasManagerInterface $alias_manager, Course $course_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentUser = $current_user;
    $this->currentRequest = $current_request;
    $this->aliasManager = $alias_manager;
    $this->courseManager = $course_manager;
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
      $container->get('logger.factory')->get('anu_lessons'),
      $container->get('current_user'),
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('path.alias_manager'),
      $container->get('anu_courses.course')
    );
  }

  /**
   * Returns a lesson node filtered by path.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {

    $lesson_path = $this->currentRequest->query->get('path');
    if (empty($lesson_path)) {
      throw new BadRequestHttpException('Missing required parameter "path".');
    }

    $path = $this->aliasManager->getPathByAlias($lesson_path);
    if (preg_match('/node\/(\d+)/', $path, $matches)) {
      /** @var \Drupal\node\NodeInterface $lesson */
      $lesson = Node::load($matches[1]);
    }

    if (empty($lesson) || (!empty($lesson) && $lesson->bundle() !== 'lesson')) {
      $message = sprintf('The requested lesson with path %s was not found.', $lesson_path);
      $this->logger->error($message);
      throw new HttpException(404, $message);
    }

    if (!$lesson->access('view')) {
      $message = sprintf('User %d doesn\'t have access to the requested lesson %d.', $this->currentUser->id(), $lesson->id());
      $this->logger->error($message);
      throw new HttpException(403, $message);
    }

    // Start building the response array.
    $data = [];
    $data['id'] = (int) $lesson->id();
    $data['title'] = $lesson->getTitle();
    $data['url'] = $this->aliasManager->getAliasByPath('/node/' . $lesson->id());

    $data['course'] = [];
    if ($lesson->hasField('field_lesson_course')) {
      $courses = $lesson->get('field_lesson_course')->referencedEntities();
      if (!empty($courses)) {
        /** @var \Drupal\node\NodeInterface $course */
        $course = array_shift($courses);
        $data['course'] = $this->courseManager->loadWithProgress($course->id());
      }
    }

    // Find progress for the current lesson based on course's progress.
    $data['progress'] = 0;
    if (!empty($data['course']['lessons'])) {
      foreach ($data['course']['lessons'] as $lesson_data) {
        if ($lesson_data['id'] == $lesson->id()) {
          $data['progress'] = $lesson_data['progress'];
        }
      }
    }

    $data['isAssessment'] = FALSE;
    if ($lesson->hasField('field_is_assessment')) {
      $value = $lesson->get('field_is_assessment')->getString();
      $data['isAssessment'] = (bool) $value;
    }

    $data['blocks'] = [];
    if ($lesson->hasField('field_lesson_blocks')) {
      $paragraphs = $lesson->get('field_lesson_blocks')->referencedEntities();
      foreach ($paragraphs as $paragraph) {
        $data['blocks'][] = $this->getParagraphData($paragraph);
      }
    }

    // TODO: Would be very cool to log user's lesson access right here,
    // instead of sending request after lesson is opened.

    return new ResourceResponse($data);
  }

  /**
   * Internal helper method to process paragraph's fields.
   *
   * @param \Drupal\paragraphs\ParagraphInterface $paragraph
   *   Paragraph object from lesson.
   *
   * @return array
   */
  protected function getParagraphData(ParagraphInterface $paragraph) {
    $data = [];
    $data['id'] = (int) $paragraph->id();
    $data['type'] = $paragraph->bundle();

    if ($paragraph->bundle() == 'divider_numbered') {
      $data['counter'] = self::$dividedCounter++;
    }

    $fields = $paragraph->getFields(FALSE);
    foreach (array_keys($fields) as $field_name) {
      $field = $fields[$field_name];

      // We search only for fields added through UI.
      if (strpos($field_name, 'field_') !== 0) {
        continue;
      }

      $field_name_trimmed = str_replace(['field_paragraph_', 'field_quiz_'], '', $field_name);
      $field_name_trimmed = str_replace(['linear_scale_'], '', $field_name_trimmed);

      switch ($field->getFieldDefinition()->getType()) {

        case 'image':
          $images = $field->referencedEntities();
          if (!empty($images)) {
            /** @var \Drupal\file\FileInterface $image */
            $image = $images[0];

            // Generate link to image with proper image style depending on
            // paragraph bundle.
            $image_style = $paragraph->bundle() == 'image_full_text' ? 'w1400' : 'w730';
            $data[$field_name_trimmed] = ImageStyle::load($image_style)->buildUrl($image->getFileUri());
          }
          break;

        case 'file':
          $files = $field->referencedEntities();
          if (!empty($files)) {
            /** @var \Drupal\file\FileInterface $file */
            $file = $files[0];
            $data[$field_name_trimmed]['fid'] = (int) $file->id();
            $data[$field_name_trimmed]['filename'] = $file->getFilename();

            // Depending on schema we should create the URL a bit different.
            // It's due to the bug in https://www.drupal.org/node/2867355.
            // We had to apply a patch to the core to get it working as expected.
            $scheme = \Drupal::service('file_system')->uriScheme($file->getFileUri());
            if ($scheme == 'private') {
              /** @var GeneratedUrl $url */
              $url = file_create_url($file->getFileUri(), TRUE);
              $data[$field_name_trimmed]['url'] = $url->getGeneratedUrl();
            }
            else {
              $data[$field_name_trimmed]['url'] = file_create_url($file->getFileUri());
            }
          }
          break;

        case 'string':
          if ($field->getFieldDefinition()->getFieldStorageDefinition()->getCardinality() == 1) {
            $data[$field_name_trimmed] = $field->getString();
          }
          else {;
            foreach ($field->getValue() as $value) {
              $data[$field_name_trimmed][] = $value['value'];
            }
          }
          break;

        // Paragraphs:
        case 'entity_reference_revisions':
          $paragraphs = $field->referencedEntities();
          foreach ($paragraphs as $paragraph) {
            $data[$field_name_trimmed][] = $this->getParagraphData($paragraph);
          }
          break;

        default:
          $value = $field->getValue();
          if ($field->getFieldDefinition()->getFieldStorageDefinition()->getCardinality() == 1) {
            if (!empty($value[0])) {
              $data[$field_name_trimmed] = $value[0];
            }
          }
          else {;
            foreach ($field->getValue() as $value) {
              $data[$field_name_trimmed][] = $value;
            }
          }
          break;
      }

    }

    return $data;
  }
}
