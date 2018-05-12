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

      foreach ($groups as $group) {
        /* @var $group \Drupal\group\Entity\Group */
        $this->addTestClassMembers($group);

        // Add all test courses and lessons into all test classes.
        /* @var $node \Drupal\node\Entity\Node */
        foreach ($nodes as $node) {
          $bundle = $node->bundle();
          if (in_array($bundle, ['course'])) {
            $plugin = 'group_node:' . $node->bundle();
            $group->addContent($node, $plugin);
          }
        }
      }
    }
  }

  /**
   * Add users into the test group.
   * @param $group \Drupal\group\Entity\Group
   */
  public function addTestClassMembers($group) {

    /* @var $role \Drupal\user\Entity\Role */
    foreach (\Drupal\user\Entity\Role::loadMultiple() as $role) {

      if ($role->id() == 'anonymous') {
        continue;
      }

      switch ($role->id()) {
        case 'teacher':
        case 'manager':
        case 'admin':
          $roles = ['class-admin'];
          break;
        default:
          $roles = [];
          break;
      }

      $values = ['group_roles' => $roles, 'gid' => $group->id()];

      $username = $role->id() . '.test';

      /* @var $account \Drupal\user\Entity\User */
      $account = user_load_by_name($username);

      if ($account) {
        $group->addMember($account, $values);
      }
    }
  }

}
