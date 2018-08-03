<?php

namespace Drupal\anu_events;

use Drupal\message\Entity\Message;
use Drupal\Component\Plugin\PluginBase;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\message_notify\Plugin\Notifier\Manager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Psr\Log\LoggerInterface;

/**
 * Base class for all events on the platform.
 */
abstract class AnuEventBase extends PluginBase implements AnuEventInterface {

  /**
   * Returns true if Event can be triggered.
   */
  abstract public function shouldTrigger();

  /**
   * Returns true if Event can be triggered.
   */
  abstract protected function getMessageBundle();

  /**
   * Returns true if Event can be triggered.
   */
  abstract protected function getTriggerer();

  /**
   * Constructs the plugin.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Psr\Log\LoggerInterface $logger
   *   The message_notify logger channel.
   * @param \Drupal\message_notify\Plugin\Notifier\Manager $notifier_manager
   *   Notifier manager object.
   * @param string $hook
   *   Triggered entity CRUD hook name.
   * @param array $context
   *   Any context data added to the event.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LoggerInterface $logger, Manager $notifier_manager, $hook = '', array $context = []) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->logger = $logger;
    $this->hook = $hook;
    $this->context = $context;
    $this->notifierManager = $notifier_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, $hook = '', array $context = NULL) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('logger.factory')->get('anu_events'),
      $container->get('plugin.message_notify.notifier.manager'),
      $hook,
      $context
    );
  }

  /**
   * Triggers Anu events.
   */
  public static function triggerAnuEvents($hook, $context) {
    $anu_event_plugins = \Drupal::service('plugin.manager.anu_event')->getDefinitions();
    foreach ($anu_event_plugins as $anu_event_plugin) {
      $anu_event = \Drupal::service('plugin.manager.anu_event')->createInstance($anu_event_plugin['id'], [], $hook, $context);
      $anu_event->trigger();
    }
  }

  /**
   * Check if event can be triggered, creates Message entity and dispatch itself.
   */
  public function trigger() {
    // Check if event can be triggered.
    if (!$this->shouldTrigger()) {
      return;
    }

    // Creates Message entity for the event.
    if ($message = $this->createMessage()) {
      $this->notifyChannels($message);
    }
  }

  /**
   * Notifies channels about happend event.
   */
  protected function notifyChannels($message) {
    $notifier_plugins = $this->notifierManager->getDefinitions();

    foreach ($notifier_plugins as $notifier_plugin) {
      $notifier = $this->notifierManager->createInstance($notifier_plugin['id'], [], $message);

      // Send only to plugins that supports shouldTrigger() method,
      // to avoid triggering unnecessary channels (it triggers all channels by default (including default email))
      if ($notifier->access() && method_exists($notifier, 'shouldTrigger') && $notifier->shouldTrigger()) {
        $notifier->send();
      }
    }
  }

  /**
   * Attach fields to the Message entity before its creation.
   */
  protected function attachMessageFields($message) {
    // We don't need to attach any fields in this class by default.
  }

  /**
   * Creates and attaches Message entity to the event.
   *
   * @param array $values
   *   (optional) An array of values to set, keyed by property name. If the
   *   entity type has bundles, the bundle key has to be specified.
   *
   * @return object
   *   Returns True if Message was successfully created, or False otherwise.
   */
  protected function createMessage(array $values = []) {
    try {
      /** @var \Drupal\message\Entity\Message $message */
      $message = Message::create([
        'template' => $this->getMessageBundle(),
        'uid' => $this->getTriggerer(),
      ] + $values);

      // Attaches an additional fields to the entity.
      $this->attachMessageFields($message);

      // Save entity.
      $saved_status = $message->save();

      return $saved_status == SAVED_NEW ? $message : NULL;
    }
    catch (\Exception $exception) {
      $message = new FormattableMarkup('Could not create a message. Error: @error', [
        '@error' => $exception->getMessage(),
      ]);
      $this->logger->error($message);
    }

    return NULL;
  }

}
