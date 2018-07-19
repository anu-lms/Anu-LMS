<?php

namespace Drupal\anu_test_content\EventSubscriber;

use Drupal\group\Entity\GroupInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\default_content\Event\ImportEvent;

/**
 * Event subscriptions for events dispatched by DefaultContentEvents.
 */
class ImportEventSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events['default_content.import'][] = ['onDefaultContentImport'];
    return $events;
  }

  /**
   * Subscriber Callback for the event.
   *
   * @param \Drupal\default_content\Event\ImportEvent $event
   *   Event object.
   */
  public function onDefaultContentImport(ImportEvent $event) {

    if ($entities = $event->getImportedEntities()) {
      // Get imported Classes.
      $groups = array_filter($entities, function ($entity) {

        /* @var $entity \Drupal\Core\Entity\ContentEntityInterface */
        return $entity->getEntityTypeId() === 'group' ? TRUE : FALSE;
      });

      // Get imported Courses and Lessons.
      $nodes = array_filter($entities, function ($entity) {
        /* @var $entity \Drupal\Core\Entity\ContentEntityInterface */
        return $entity->getEntityTypeId() === 'node' ? TRUE : FALSE;
      });

      // Get imported Users.
      $users = array_filter($entities, function ($entity) {
        /* @var $entity \Drupal\Core\Entity\ContentEntityInterface */
        return $entity->getEntityTypeId() === 'user' ? TRUE : FALSE;
      });

      if ($users) {
        $this->setUsersPasswords($users);
      }

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
   *
   * @param \Drupal\group\Entity\GroupInterface $group
   *   Group object.
   * @param \Drupal\user\Entity\User[] $users
   *   List of users that needs to be added to the given group.
   */
  public function addTestClassMembers(GroupInterface $group, array $users) {
    $admin_roles = ['teacher', 'moderator', 'administrator'];

    /* @var $user \Drupal\user\Entity\User */
    foreach ($users as $user) {
      $roles = array_intersect($user->getRoles(), $admin_roles) ? ['class-admin'] : [];
      $values = ['group_roles' => $roles, 'gid' => $group->id()];
      $group->addMember($user, $values);
    }
  }

  /**
   * Set test users passwords if they're defined at platform.sh.
   *
   * @param \Drupal\user\Entity\User[] $users
   *   List of users to set test password for.
   *
   * @throws \Exception
   */
  public function setUsersPasswords(array $users) {
    if (isset($_ENV['TEST_USERS_PASS'])) {
      foreach ($users as $user) {
        $user->setPassword($_ENV['TEST_USERS_PASS']);
        $user->save();
      }
    }
  }

}
