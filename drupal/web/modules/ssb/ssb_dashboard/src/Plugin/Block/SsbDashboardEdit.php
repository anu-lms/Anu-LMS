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
        'name' => t('Content'),
        'description' => t('Edit or delete existing content in the system.'),
      ];
      // Uncomment when we fix quiz by organizations.
//      $items[] = [
//        'url' => \Drupal\Core\Url::fromRoute('view.quiz_results.page_1')
//          ->toString(),
//        'name' => t('Quiz results'),
//        'description' => t('Review results of Quizzes.'),
//      ];
    }

    if ($user->hasPermission('bypass group access')) {
      $items[] = [
        'url' => \Drupal\Core\Url::fromUri('internal:/admin/admin/content/classes'),
        'name' => t('Classes'),
        'description' => t('Create, edit or delete classes.'),
      ];
    }

    if ($user->hasPermission('administer users')) {
      $items[] = [
        'url' => \Drupal\Core\Url::fromRoute('entity.user.collection')
          ->toString(),
        'name' => t('Users'),
        'description' => t('Create, edit or delete users.'),
      ];
    }

    if ($user->hasPermission('administer taxonomy')) {
      $items[] = [
        'url' => \Drupal\Core\Url::fromUri('internal:/admin/structure/taxonomy/manage/organisations/overview'),
        'name' => t('Organizations'),
        'description' => t('Create, edit or delete organizations.'),
      ];
    }

    // Uncomment if we need this part on the dashboard.
//    $group_entities = \Drupal::entityTypeManager()->getStorage('group')->loadMultiple();
//    foreach ($group_entities as $group) {
//      if ($group->access('update')) {
//        $items[] = [
//          'url' => \Drupal\Core\Url::fromRoute('entity.group.edit_form', ['group' => $group->id()]),
//          'name' => t('Edit %group', ['%group' => $group->label()]),
//          'description' => t('Change content of @group.', ['@group' => $group->bundle()]),
//        ];
//      }
//    }

    $build = [];
    $build['#items'] = $items;
    $build['#theme'] = 'dashboard_block';
    return $build;
  }

}
