<?php

/**
 * @file
 * Contains \Drupal\anu_test_content\EventSubscriber\ImportEventSubscriber.
 */

namespace Drupal\anu_test_content\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\default_content\Event\ImportEvent;


/**
 * Event subscriptions for events dispatched by DefaultContentEvents
 */
class ImportEventSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events['default_content.import'][] = array('onDefaultContentImport');
    return $events;
  }

  /**
   * Subscriber Callback for the event.
   * @param ImportEvent $event
   */
  public function onDefaultContentImport(ImportEvent $event) {

    if ($entities = $event->getImportedEntities()) {
      // Get imported Classes.
      $groups = array_filter($entities, function($entity) {

        /* @var $entity \Drupal\Core\Entity\ContentEntityInterface */
        return $entity->getEntityTypeId() === 'group' ? true : false;
      });

      // Get imported Courses and Lessons.
      $nodes = array_filter($entities, function($entity) {
        /* @var $entity \Drupal\Core\Entity\ContentEntityInterface */
        return $entity->getEntityTypeId() === 'node' ? true : false;
      });

      // Get imported Users.
      $users = array_filter($entities, function($entity) {
        /* @var $entity \Drupal\Core\Entity\ContentEntityInterface */
        return $entity->getEntityTypeId() === 'user' ? true : false;
      });

      foreach ($groups as $group) {
        /* @var $group \Drupal\group\Entity\Group */
        $this->addTestClassMembers($group, $users);

        // Add all test courses and lessons into all test classes.
        /* @var $node \Drupal\node\Entity\Node */
        foreach ($nodes as $node) {
          $bundle = $node->bundle();
          if (in_array($bundle, ['course'])) {
            $plugin = 'group_node:' . $bundle;
            $group->addContent($node, $plugin);
          }
        }
      }
    }
  }

  /**
   * Add users into the test group.
   * @param $group \Drupal\group\Entity\Group
   * @param $users \Drupal\user\Entity\User[]
   */
  public function addTestClassMembers($group, $users) {

    /* @var $user \Drupal\user\Entity\User */
    foreach ($users as $user) {

      $roles = array_intersect($user->getRoles(), ['teacher', 'moderator', 'administrator']) ? ['class-admin'] : [];
      $values = ['group_roles' => $roles, 'gid' => $group->id()];
      $group->addMember($user, $values);

    }

  }

  /**
   * Set test users passwords if they're defined at platform.sh.
   * @param $users \Drupal\user\Entity\User[]
   */
  function setPasswords($users) {
    if (isset($_ENV["TEST_USERS_PASS"])) {
      foreach ($users as $user) {
        $user->setPassword($_ENV["TEST_USERS_PASS"]);
        $user->save();
      }
    }
  }

}
