<?php

namespace Drupal\anu_user\Controller;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\Entity\User;

/**
 *
 */
class UserImport extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'anu_user_import';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['file'] = [
      '#type' => 'file',
      '#title' => t('CSV File with users'),
      '#description' => t('The desired file format and structure can be found <a href="@url">here</a>.', [
        '@url' => 'https://anu-lms.readme.io/v1.0/docs/bulk-users-import',
      ]),
    ];

    $form['send_welcome_email'] = [
      '#type' => 'checkbox',
      '#title' => t('Send Welcome email'),
      '#description' => t('All created users will receive a welcome email with password reset link.'),
      '#default_value' => TRUE,
    ];

    // Build a list of available groups.
    $group_list = [];
    try {
      $groups = \Drupal::entityTypeManager()
        ->getStorage('group')
        ->loadMultiple();

      foreach ($groups as $group) {
        if ($group->access('update')) {
          $group_list[$group->id()] = $group->label();
        }
      }
    }
    catch (\Exception $exception) {
      $message = t('Could not load groups on the Users Import page.');
      \Drupal::logger('anu_user')->error($message);
      drupal_set_message($message, 'error');
    }

    $form['classes'] = [
      '#title' => t('Classes to assign'),
      '#description' => t('Select list of classes which will be automatically assigned to all created users.'),
      '#type' => 'checkboxes',
      '#options' => $group_list,
    ];

    // Build a list of available organizations.
    $organization_list = [
      0 => t('- None -'),
    ];

    try {
      $organizations = \Drupal::entityTypeManager()
        ->getStorage('taxonomy_term')
        ->loadByProperties([
          'vid' => 'organisations',
        ]);

      foreach ($organizations as $organization) {
        if ($organization->access('view')) {
          $organization_list[$organization->id()] = $organization->label();
        }
      }
    }
    catch (\Exception $exception) {
      $message = t('Could not load organizations on the Users Import page.');
      \Drupal::logger('anu_user')->error($message);
      drupal_set_message($message, 'error');
    }

    $form['organization'] = [
      '#title' => t('Organization to assign'),
      '#type' => 'select',
      '#description' => t('Select an organization which will be automatically assigned to all created users.'),
      '#options' => $organization_list,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => t('Start import'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $files = $this->getRequest()->files->get('files');

    // Make sure the file was uploaded.
    if (empty($files['file'])) {
      $form_state->setErrorByName('file', t('You must upload a file.'));
      return;
    }

    // Make sure we are able to parse the file.
    $data = array_map('str_getcsv', file($files['file']->getRealPath(), FILE_IGNORE_NEW_LINES));
    if (empty($data)) {
      $form_state->setErrorByName('file', t('The file data is invalid. Please, read the documentation to figure out the file\'s structure.'));
      return;
    }

    // Make sure the first line of the file  is just a header.
    $first_line = $data[0];
    if (\Drupal::service('email.validator')->isValid($first_line[3])) {
      $form_state->setErrorByName('file', t('The first line of the file should contain just headers and not the real user data.'));
    }

    // Remove the header from the list of data.
    unset($data[0]);

    // Make sure the file contains actual user data.
    if (empty($data)) {
      $form_state->setErrorByName('file', t('The file does not contain user data.'));
    }

    foreach ($data as $line_number => $line) {

      // Make sure the amount of columns is correct.
      if (count($line) != 4) {
        $form_state->setErrorByName('file', t('The line @line contains wrong amount of columns. Expected: 4.', [
          '@line' => $line_number,
        ]));
      }

      // Make sure the email is valid.
      if (!\Drupal::service('email.validator')->isValid($line[3])) {
        $form_state->setErrorByName('file', t('The line @line in the file contains invalid email address.', [
          '@line' => $line_number,
        ]));
      }

      // Make sure we don't have an account with this name in the system already.
      try {
        $account = \Drupal::entityTypeManager()
          ->getStorage('user')
          ->loadByProperties(['name' => $line[2]]);

        if (!empty($account)) {
          $form_state->setErrorByName('file', t('The user with name %name already exists.', [
            '%name' => $line[2],
          ]));
        }
      }
      catch (\Exception $exception) {
        // Do nothing here.
      }

      // Make sure we don't have an account with this email in the system already.
      try {
        $email = \Drupal::entityTypeManager()
          ->getStorage('user')
          ->loadByProperties(['mail' => $line[3]]);

        if (!empty($email)) {
          $form_state->setErrorByName('file', t('The user with email @email already exists.', [
            '@email' => $line[3],
          ]));
        }
      }
      catch (\Exception $exception) {
        // Do nothing here.
      }
    }

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    // Get the file with.
    $file = $this->getRequest()->files->get('files')['file'];
    $data = array_map('str_getcsv', file($file->getRealPath(), FILE_IGNORE_NEW_LINES));

    // Remove the first line with header.
    unset($data[0]);

    // Get values from the form UI.
    $classes = array_filter($form_state->getValue('classes'));
    $organization = $form_state->getValue('organization');
    $notify = $form_state->getValue('send_welcome_email');

    $operations = [];
    foreach ($data as $values) {
      $operations[] = [
        '\Drupal\anu_user\Controller\UserImport::saveUser',
        // First name, Last name, Username, Email, Classes array,
        // Organization term ID, Boolean welcome email.
        [$values[0], $values[1], $values[2], $values[3], $classes, $organization, $notify],
      ];
    }

    $batch = [
      'title' => t('Importing users'),
      'operations' => $operations,
      'finished' => '\Drupal\anu_user\Controller\UserImport::saveUserFinishedCallback',
    ];

    batch_set($batch);

  }

  /**
   * Batch operation callback.
   * Creates a new user in the system.
   *
   * @param $first_name
   *   User's first name.
   *
   * @param $last_name
   *   User's last name.
   *
   * @param $account_name
   *   User's account name in the system.
   *
   * @param $email
   *   User's email in the system.
   *
   * @param array $classes
   *   Array of groups to automatically assign to the user.
   *
   * @param int $organization
   *   ID of Organization term to assign to the user.
   *
   * @param bool $notify
   *   Send welcome email to created user or not.
   *
   * @param $context
   *   Internal batch's variable.
   */
  public static function saveUser($first_name, $last_name, $account_name, $email, array $classes = [], $organization = 0, $notify = FALSE, &$context) {

    try {

      $user = User::create([
        'name' => $account_name,
        'mail' => $email,
        'pass' => \user_password(),
        'status' => 1,
        'field_first_name' => $first_name,
        'field_last_name' => $last_name,
      ]);

      // Assign an organization if defined on the form.
      if (!empty($organization)) {
        $user->field_organization->target_id = $organization;
      }

      // Create a new user in the system.
      $user->save();

      // Send welcome email if needed.
      if (!empty($notify)) {
        _user_mail_notify('register_admin_created', $user);
      }

      // Assigning user to the selected groups.
      $groups = \Drupal::entityTypeManager()
        ->getStorage('group')
        ->loadMultiple($classes);

      foreach ($groups as $group) {
        $group->addMember($user);
      }
    }
    catch (\Exception $exception) {
      $message = t('Could not create a user during bulk import.');
      \Drupal::logger('anu_user')->critical($message);
      drupal_set_message($message, 'error');
    }

    $context['message'] = t('Importing user @email', ['@email' => $email]);
    $context['results'][] = $email;
  }

  /**
   * Batch finish callback.
   */
  public static function saveUserFinishedCallback($success, $results) {
    if ($success) {
      $message = \Drupal::translation()->formatPlural(
        count($results),
        'One user imported.', '@count users imported.'
      );
      drupal_set_message($message);
    }
    else {
      drupal_set_message(t('Finished with an error.'), 'error');
    }
  }

}
