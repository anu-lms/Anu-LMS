<?php

namespace Drupal\anu_content_administration\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\StringFilter;
use Drupal\views\ViewExecutable;
use Drupal\Core\Database\Database;

/**
 * Filters content by groups they belong to.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("anu_course_lessons_filter")
 */
class CourseLessonsFilter extends StringFilter {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Lessons filter');
  }

  public function validate() {
    if (!empty($this->value)) {
      parent::validate();
    }
  }

  public function query() {
    $value = Database::getConnection()->escapeLike($this->value);
    $this->query->addWhereExpression(0, "node_field_data.nid IN (
      SELECT field_lesson_course_target_id FROM {node__field_lesson_course} 
      INNER JOIN {node_field_data} ON node_field_data.nid = node__field_lesson_course.entity_id
      WHERE node_field_data.title LIKE '%$value%'
    )");
  }

}
