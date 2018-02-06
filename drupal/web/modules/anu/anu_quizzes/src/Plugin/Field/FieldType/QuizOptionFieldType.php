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
 *   default_widget = "quiz_option",
 *   default_formatter = "string"
 * )
 */
class QuizOptionFieldType extends StringItem {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = parent::schema($field_definition);

    // BE AWARE: uuid doesn't have SQL-level unique index due to Field Storage
    // API caveats. Developers must use reliable UUID generators to avoid
    // duplicated UUID values.
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

    return $schema;

  }

  /**
   * {@inheritdoc}
   */
  public function preSave() {
    parent::preSave();

    // Generate UUID for new items.
    // BE AWARE: previous UUID will be overwritten by new one unless it's
    // explicitly passed into save function.
    if (empty($this->uuid)) {
      $this->uuid = \Drupal::service('uuid')->generate();
    }

  }

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
  public static function defaultFieldSettings() {
    $settings = ['type' => 'single'];

    return $settings + parent::defaultFieldSettings();
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
