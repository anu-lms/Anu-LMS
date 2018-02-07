<?php

namespace Drupal\anu_quizzes\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldWidget\StringTextfieldWidget;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'quiz_option' widget.
 *
 * @FieldWidget(
 *   id = "quiz_option",
 *   label = @Translation("Quiz option"),
 *   field_types = {
 *     "quiz_option"
 *   }
 * )
 */
class QuizOptionWidget extends StringTextfieldWidget {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    // Submit UUID along with the value to support reordering.
    $widget['uuid'] = [
      '#type' => 'hidden',
      '#default_value' => isset($items[$delta]->uuid) ? $items[$delta]->uuid : NULL,
    ];
    // Option label.
    $widget['value'] = [
      '#type' => 'textfield',
      '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
      '#size' => $this->getSetting('size'),
      '#placeholder' => $this->getSetting('placeholder'),
      '#maxlength' => $this->getFieldSetting('max_length'),
      '#attributes' => ['class' => ['js-text-full', 'text-full']],
    ];
    // Is Answer flag. Not used yet.
    $widget['is_answer'] = [
      '#type' => 'hidden',
      '#default_value' => isset($items[$delta]->is_answer) ? $items[$delta]->is_answer : 0,
    ];

    return $element + $widget;
  }

}
