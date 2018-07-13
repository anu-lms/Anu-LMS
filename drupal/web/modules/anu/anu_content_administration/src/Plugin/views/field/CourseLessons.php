<?php

namespace Drupal\anu_content_administration\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Component\Utility\Html;
use Drupal\views\ResultRow;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Field handler to show list of course lessons.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("anu_course_lessons")
 */
class CourseLessons extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $output = [];
    $course = $values->_entity;

    try {
      // If Course was removed from the Class we remove all child lessons from this Class as well.
      foreach ($course->field_course_lessons as $course_lesson) {
        if (empty($course_lesson->entity)) {
          continue;
        }
        /** @var \Drupal\node\Entity\Node $lesson */
        $lesson = $course_lesson->entity;
        $status_label = !$lesson->isPublished() ? ' <span class="content-unpublished">(' . $this->t('unpublished') . ')</span>' : '';

        $edit_link = Link::fromTextAndUrl(
          $this->t('[edit]'),
          Url::fromUri('internal:/node/' . $lesson->id() . '/edit', ['query' => \Drupal::destination()->getAsArray()])
        );

        $output[] = ['#markup' => Html::escape($lesson->label()) . $status_label . ' ' . $edit_link->toString()];
      }
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not get list of lessons of course @id. Error: @error', [
        '@id' => $course->id(),
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_group')->error($message);
    }

    if (count($output) > 1) {
      return [
        '#theme' => 'item_list',
        '#items' => $output,
        '#title' => NULL,
      ];
    }

    return $output;
  }

}
