<?php

namespace Drupal\ssb_dashboard\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\ssb_dashboard\DashboardClass;

/**
 * Provides a 'SsbDashboardEdit' block.
 *
 * @Block(
 *  id = "ssb_dashboard_edit",
 *  admin_label = @Translation("Content Edit"),
 * )
 */
class SsbDashboardEdit extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $user = \Drupal::currentUser();
    $items = [];

    if ($user->hasPermission('access content overview')) {
      $items[] = [
        'url' => \Drupal\Core\Url::fromRoute('system.admin_content')
          ->toString(),
        'name' => t('Edit content'),
        'description' => t('Edit or delete existing content in the system.'),
      ];
      $items[] = [
        'url' => \Drupal\Core\Url::fromRoute('view.quiz_results.page_1')
          ->toString(),
        'name' => t('Quiz results'),
        'description' => t('Review results of Quizzes.'),
      ];
    }

    if ($user->hasPermission('administer users')) {
      $items[] = [
        'url' => \Drupal\Core\Url::fromRoute('entity.user.collection')
          ->toString(),
        'name' => t('Manage people'),
        'description' => t('Create, edit or delete users.'),
      ];
    }

    $group_entities = \Drupal::entityTypeManager()->getStorage('group')->loadMultiple();
    foreach ($group_entities as $group) {
      if ($group->access('update')) {
        $items[] = [
          'url' => \Drupal\Core\Url::fromRoute('entity.group.edit_form', ['group' => $group->id()]),
          'name' => t('Edit %group', ['%group' => $group->label()]),
          'description' => t('Change content of @group.', ['@group' => $group->bundle()]),
        ];
      }
    }

    $build = [];
    $build['#items'] = $items;
    $build['#theme'] = 'dashboard_block';
    return $build;
  }

}
