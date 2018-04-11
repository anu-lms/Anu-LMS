<?php

namespace Drupal\anu_classes\Plugin\rest\resource;

use Drupal\Component\Utility\Html;
use Drupal\image\Entity\ImageStyle;
use Drupal\user\Entity\User;
use Drupal\group\Entity\GroupContent;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\Component\Render\FormattableMarkup;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to get and update Learner progress.
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
   * Constructs a new LearnerProgressResource object.
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
   * Return list of course resources accessible for the
   * logged in user.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $response = [];

    try {

      $user = User::load(\Drupal::currentUser()->id());
      $group_contents = GroupContent::loadByEntity($user);

      /* @var $group_content \Drupal\group\Entity\GroupContent */
      foreach ($group_contents as $group_content) {

        /* @var $group \Drupal\group\Entity\Group */
        $group = $group_content->getGroup();

        $response[$group->id()] = [
          'group_name' => Html::escape($group->label()),
        ];

        $courses = $group->getContentEntities('group_node:course');

        /* @var $course \Drupal\node\Entity\Node */
        foreach ($courses as $course) {

          $image_url = '';
          if (!$course->get('field_course_image')->isEmpty()) {
            $uri = $course->get('field_course_image')->entity->getFileUri();
            $image_url = ImageStyle::load('576x450')->buildUrl($uri);
          }

          $path_alias = \Drupal::service('path.alias_manager')
            ->getAliasByPath('/node/' . $course->id());

          $response[$group->id()]['courses'][] = [
            'label' => Html::escape($course->label()),
            'id' => $course->id(),
            'image' => $image_url,
            'path' => $path_alias,
          ];
        }

      }

    } catch(\Exception $e) {
      $message = new FormattableMarkup('Could not load classes with courses. Error: @error', [
        '@error' => $e->getMessage()
      ]);
      $this->logger->critical($message);
      return new ResourceResponse(['message' => $message], 406);
    }

    return !empty($response) ? new ResourceResponse($response) : new ResourceResponse();
  }
}
