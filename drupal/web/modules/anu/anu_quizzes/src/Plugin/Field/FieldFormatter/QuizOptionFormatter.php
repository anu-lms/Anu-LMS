<?php

namespace Drupal\anu_quizzes\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Formatter for Quiz Option field, outputs quiz option value by uuid.
 *
 * @FieldFormatter(
 *   id = "quiz_option_formatter",
 *   label = @Translation("Quiz Option"),
 *   field_types = {
 *     "string"
 *   }
 * )
 */
class QuizOptionFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    // We don't call the parent in order to bypass the link to file form.
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    $connection = \Drupal::database();

    foreach ($items as $delta => $item) {
      // Gets human readable label from Quiz option field by given uuid.
      $query = $connection->select('paragraph_revision__field_quiz_options', 'prq');
      $query->condition('prq.field_quiz_options_uuid', $item->value);
      $query->fields('prq', ['field_quiz_options_value']);
      $query->orderBy('prq.revision_id', 'DESC');
      $query->range(0, 1);
      $result = $query->execute();

      $elements[$delta] = ['#markup' => Html::escape($result->fetchField())];
    }

    return $elements;
  }

}
