<?php

namespace Drupal\anu_quizzes\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\StringItem;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'quiz_option' field type.
 *
 * @FieldType(
 *   id = "quiz_option",
 *   label = @Translation("Quiz option"),
 *   description = @Translation("Quiz Option field to store option id, label and is_answer flag."),
 *   default_widget = "string_textfield",
 *   default_formatter = "string"
 * )
 */
class QuizOptionFieldType extends StringItem {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = parent::schema($field_definition);

    $schema['columns']['uuid'] = [
      'type' => 'varchar_ascii',
      'length' => 128,
      'not null' => TRUE,
      'default' => '',
    ];

    $schema['columns']['is_answer'] = [
      'type' => 'int',
      'size' => 'tiny',
      'not null' => TRUE,
      'default' => 0,
    ];

    // Index is required for auto_increment fields.
    $schema['unique keys'][] = 'uuid';

    return $schema;

  }

  //  public function setValue($values, $notify = TRUE) {
  //    parent::setValue($values, $notify);
  //  }
  //
  //  public function preSave() {
  //    parent::preSave();
  //  }


  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties = parent::propertyDefinitions($field_definition);

    $properties['uuid'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Option UUID'));

    $properties['is_answer'] = DataDefinition::create('integer')
      ->setLabel(new TranslatableMarkup('Is answer'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function fieldSettingsForm(array $form, FormStateInterface $form_state) {
    $form = parent::fieldSettingsForm($form, $form_state);
    $settings = $this->getSettings();

    $form['type'] = [
      '#type' => 'radios',
      '#title' => t('Type'),
      '#default_value' => isset($settings['type']) ? $settings['type'] : 'single',
      '#options' => [
        'single' => t('Single option (comboboxes)'),
        'multiple' => t('Multiple options (checkboxes)'),
      ],
    ];

    return $form;
  }

}
