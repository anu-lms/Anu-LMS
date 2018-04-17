<?php

namespace Drupal\anu_classes\Plugin\rest\resource;

use Drupal\image\Entity\ImageStyle;
use Drupal\user\Entity\User;
use Drupal\group\Entity\GroupContent;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to load classes with assigned courses
 * available for the currently authenticated user.
 *
 * @RestResource(
 *   id = "classes_courses_resources",
 *   label = @Translation("Classes with courses resources"),
 *   uri_paths = {
 *     "canonical" = "/classes/courses"
 *   }
 * )
 */
class ClassesWithCoursesResource extends ResourceBase {

  /**
   * Constructs a new ClassesWithCoursesResource object.
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
      $container->get('logger.factory')->get('anu_classes')
    );
  }

  /**
   * Return list of classes and assigned to them resources
   * available for the currently logged in user.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $response = [];

    try {

      // Load a user object for the current user.
      $user = User::load(\Drupal::currentUser()->id());

      // Load all group membership entities where the current user is a member.
      $group_contents = GroupContent::loadByEntity($user);

      /* @var $learnerProgress \Drupal\anu_learner_progress\LearnerProgress */
      $learner_progress = \Drupal::service('anu_learner_progress.learner_progress');

      // Get the list of courses progress for the current user.
      $progress = $learner_progress->load();

      /* @var $group_content \Drupal\group\Entity\GroupContent */
      foreach ($group_contents as $group_content) {

        /* @var $group \Drupal\group\Entity\Group */
        $group = $group_content->getGroup();

        // Make sure the current user can view the group.
        if (!$group->access('view')) {
          continue;
        }

        // Start building a response with some basic group info.
        $response[$group->id()] = [
          'group_id' => $group->id(),
          'group_name' => $group->label(),
        ];

        // Load all courses from the group.
        $courses = $group->getContentEntities('group_node:course');

        /* @var $course \Drupal\node\Entity\Node */
        foreach ($courses as $course) {

          // Make sure the current user can view the course.
          if (!$course->access('view')) {
            continue;
          }

          // Build a link to the course's cover image.
          $image_url = '';
          if (!$course->get('field_course_image')->isEmpty()) {
            $uri = $course->get('field_course_image')->entity->getFileUri();
            $image_url = ImageStyle::load('576x450')->buildUrl($uri);
          }

          // Get the course path alias.
          $path_alias = \Drupal::service('path.alias_manager')
            ->getAliasByPath('/node/' . $course->id());

          // Find a progress associated with the current course.
          $course_progress = [];
          foreach ($progress as $progress_item) {
            if ($progress_item['courseId'] == $course->id()) {
              $course_progress = $progress_item;
              unset($course_progress['courseId']);
            }
          }

          $response[$group->id()]['courses'][] = [
              'id' => $course->id(),
              'label' => $course->label(),
              'image' => $image_url,
              'path' => $path_alias,
            ] + $course_progress;
        }

      }

    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not load classes with courses. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
      return new ResourceResponse(['message' => $message], 406);
    }

    return !empty($response) ? new ResourceResponse(array_values($response)) : new ResourceResponse();
  }
}
