<?php

namespace Drupal\anu_comments_notifier\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\CronInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\State\StateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Comments notifier configuration form..
 */
class AnuCommentsNotifierForm extends ConfigFormBase {

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The cron service.
   *
   * @var \Drupal\Core\CronInterface
   */
  protected $cron;

  /**
   * The state keyvalue collection.
   *
   * @var \Drupal\Core\State\StateInterface
   */
  protected $state;

  /**
   * {@inheritdoc}
   */
  public function __construct(ConfigFactoryInterface $config_factory, AccountInterface $current_user, CronInterface $cron, StateInterface $state) {
    parent::__construct($config_factory);
    $this->currentUser = $current_user;
    $this->cron = $cron;
    $this->state = $state;

  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $form = new static(
      $container->get('config.factory'),
      $container->get('current_user'),
      $container->get('cron'),
      $container->get('state')
    );
    $form->setMessenger($container->get('messenger'));
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'anu_comments_notifier';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->configFactory->get('anu_comments_notifier.settings');

    $form['comments'] = [
      '#type' => 'details',
      '#title' => $this->t('Comments state'),
      '#open' => TRUE
    ];

    $form['comments']['counts'] = [
      '#type' => 'view',
      '#name' => 'comments',
      '#display_id' => 'block_1'
    ];

    $form['status'] = [
      '#type' => 'details',
      '#title' => $this->t('Cron status information'),
      '#open' => TRUE,
    ];

    $next_execution = \Drupal::state()->get('anu_comments_notifier.next_execution');
    $request_time = \Drupal::time()->getRequestTime();
    $next_execution = !empty($next_execution) ? $next_execution : $request_time;

    $args = [
      '%time' => date_iso8601($next_execution),
      '%seconds' => max($next_execution - $request_time, 0),
    ];
    $form['status']['last'] = [
      '#type' => 'item',
      '#markup' => $this->t('Task will execute at next cron run, but not sooner than at %time (%seconds seconds from now)', $args),
    ];

    if ($this->currentUser->hasPermission('administer site configuration')) {
      $form['cron_run'] = [
        '#type' => 'details',
        '#title' => $this->t('Run cron manually'),
        '#open' => TRUE,
      ];
      $form['cron_run']['cron_reset'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Force running cron task regardless of whether interval has expired.'),
        '#default_value' => FALSE,
      ];
      $form['cron_run']['cron_trigger']['actions'] = ['#type' => 'actions'];
      $form['cron_run']['cron_trigger']['actions']['sumbit'] = [
        '#type' => 'submit',
        '#value' => $this->t('Run cron now'),
        '#submit' => [[$this, 'cronRun']],
      ];
    }
    $form['configuration'] = [
      '#type' => 'details',
      '#title' => $this->t('Configuration'),
      '#open' => TRUE,
    ];
    $form['configuration']['interval'] = [
      '#type' => 'select',
      '#title' => $this->t('Cron interval'),
      '#description' => $this->t('Time after which cron task will respond to a processing request.'),
      '#default_value' => $config->get('interval') ? $config->get('interval') : 86400 * 7,
      '#options' => [
        60 => $this->t('1 minute'),
        300 => $this->t('5 minutes'),
        3600 => $this->t('1 hour'),
        86400 => $this->t('1 day'),
        86400 * 7 => $this->t('1 week'),
      ],
    ];
    $form['configuration']['limit'] = [
      '#type' => 'number',
      '#title' => $this->t('Comments limit'),
      '#description' => $this->t('Maximum amount of comments per paragraph, which will trigger email notification.'),
      '#default_value' => $config->get('limit') ? $config->get('limit') : 50,
    ];
    $form['configuration']['email'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Email for notifications'),
      '#description' => $this->t('Comma delimited list of email addresses.'),
      '#default_value' => $config->get('email'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * Allow user to directly execute cron, optionally forcing it.
   */
  public function cronRun(array &$form, FormStateInterface &$form_state) {
    $cron_reset = $form_state->getValue('cron_reset');
    if (!empty($cron_reset)) {
      \Drupal::state()->set('anu_comments_notifier.next_execution', 0);
    }

    // Use a state variable to signal that cron was run manually from this form.
    $this->state->set('anu_comments_notifier_show_status_message', TRUE);
    if ($this->cron->run()) {
      $this->messenger()->addMessage($this->t('Cron ran successfully.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Update the interval as stored in configuration. This will be read when
    // this modules hook_cron function fires and will be used to ensure that
    // action is taken only after the appropiate time has elapsed.
    $this->configFactory->getEditable('anu_comments_notifier.settings')
      ->set('interval', $form_state->getValue('interval'))
      ->set('limit', $form_state->getValue('limit'))
      ->set('email', $form_state->getValue('email'))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['anu_comments_notifier.settings'];
  }

}
