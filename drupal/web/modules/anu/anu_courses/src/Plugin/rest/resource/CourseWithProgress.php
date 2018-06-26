<?php

namespace Drupal\anu_courses\Plugin\rest\resource;

use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Path\AliasManagerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\Entity\Node;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Provides a course with learner's progress.
 *
 * @RestResource(
 *   id = "course_with_progress",
 *   label = @Translation("Course info with learner progress"),
 *   uri_paths = {
 *     "canonical" = "/course/progress"
 *   }
 * )
 */
class CourseWithProgress extends ResourceBase {

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
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, AccountProxyInterface $current_user, Request $current_request, AliasManagerInterface $alias_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->currentUser = $current_user;
    $this->currentRequest = $current_request;
    $this->aliasManager = $alias_manager;
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
      $container->get('logger.factory')->get('anu_learner_progress'),
      $container->get('current_user'),
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('path.alias_manager')
    );
  }

  /**
   * Returns a course node filtered by path with
   * breakdown for learner's progress.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {

    $course_path = $this->currentRequest->query->get('path');
    if (empty($course_path)) {
      throw new BadRequestHttpException('Missing required parameter "path".');
    }

    $path = $this->aliasManager->getPathByAlias($course_path);
    if (preg_match('/node\/(\d+)/', $path, $matches)) {
      /** @var \Drupal\node\NodeInterface $course */
      $course = Node::load($matches[1]);
    }

    if (empty($course) || (!empty($course) && $course->bundle() !== 'course')) {
      $message = sprintf('The requested course with path %s was not found.', $course_path);
      $this->logger->error($message);
      throw new HttpException(404, $message);
    }

    if (!$course->access('view')) {
      $message = sprintf('User %d doesn\'t have access to the requested course %d.', $this->currentUser->id(), $course->id());
      $this->logger->error($message);
      throw new HttpException(403, $message);
    }

    // Fetch learner's progress for the requested course and its lessons.
    /* @var $learnerProgress \Drupal\anu_learner_progress\LearnerProgress */
    $learnerProgress = \Drupal::service('anu_learner_progress.learner_progress');
    try {
      // Fetch learner's progress for a given course.
      $progress = $learnerProgress->loadDetailed($course->id());
    } catch (\Exception $exception) {
      $message = sprintf('Could not fetch learner progress for course %d. Error: %s', $course->id(), $exception->getMessage());
      $this->logger->error($message);
      throw new HttpException(400, $message);
    }

    // Start building the response array.
    $data = [];
    $data['id'] = $course->id();
    $data['created'] = $course->getCreatedTime();
    $data['title'] = $course->getTitle();
    $data['url'] = $this->aliasManager->getAliasByPath('/node/' . $course->id());
    $data['progress'] = round($progress['course']); // Current learner's progress.

    $data['description'] = '';
    if ($course->hasField('field_course_description')) {
      $value = $course->get('field_course_description')->value;
      $data['description'] = Xss::filter($value);
    }

    $data['organisation'] = '';
    if ($course->hasField('field_course_organisation')) {
      $list = [];
      $organizations = $course->get('field_course_organisation')->referencedEntities();
      foreach ($organizations as $organization) {
        /** @var \Drupal\taxonomy\TermInterface $organization */
        $list[] = $organization->getName();
      }
      $data['organisation'] = implode(', ', $list);
    }

    $data['totalMinutes'] = 0;
    if ($course->hasField('field_time_to_complete_minutes')) {
      $value = $course->get('field_time_to_complete_minutes')->getString();
      $data['totalMinutes'] = (int) $value;
    }

    $data['hasResources'] = FALSE;
    if ($course->hasField('field_course_has_resources')) {
      $value = $course->get('field_course_has_resources')->getString();
      $data['hasResources'] = (bool) $value;
    }

    $data['instructors'] = [];
    if ($course->hasField('field_course_instructors')) {
      $instructors = $course->get('field_course_instructors')->referencedEntities();

      /** @var \Drupal\user\UserInterface $instructor */
      foreach ($instructors as $instructor) {
        $name = '';
        if ($instructor->hasField('field_first_name')) {
          $name = $instructor->get('field_first_name')->getString();
        }
        if ($instructor->hasField('field_last_name')) {
          $value = $instructor->get('field_last_name')->getString();
          $name = empty($name) ? $value : $name . ' ' . $value;
        }

        // Fallback to the user account name.
        $name = !empty($name) ? $name : $instructor->getAccountName();
        $data['instructors'][] = Html::escape($name);
      }
    }

    $data['lessons'] = [];
    if ($course->hasField('field_course_lessons')) {
      $lessons = $course->get('field_course_lessons')->referencedEntities();
      /** @var \Drupal\node\NodeInterface $lesson */
      foreach ($lessons as $lesson) {
        if ($lesson->access('view')) {
          $data['lessons'][] = [
            'id' => $lesson->id(),
            'title' => Html::escape($lesson->getTitle()),
            'url' => $this->aliasManager->getAliasByPath('/node/' . $lesson->id()),
            'progress' => !empty($progress['lessons'][$lesson->id()]) ? round($progress['lessons'][$lesson->id()]) : 0,
          ];
        }
      }
    }

    $data['coverImage'] = '';
    if ($course->hasField('field_course_image')) {
      $files = $course->get('field_course_image')->referencedEntities();
      if (!empty($files[0])) {
        /** @var \Drupal\file\FileInterface $file */
        $file = $files[0];
        $data['coverImage'] = ImageStyle::load('576x450')->buildUrl($file->getFileUri());
      }
    }

    return new ResourceResponse($data);
  }
}
