<?php

namespace Drupal\anu_events\Plugin\Notifier;


/**
 * Email notifier.
 *
 * @Notifier(
 *   id = "email_notifier",
 *   title = @Translation("Email notifier"),
 *   description = @Translation("Send email notifications"),
 * )
 */
class EmailNotifier extends MessageNotifierBase {

  /**
   * {@inheritdoc}
   */
  public function deliver(array $output = []) {

    try {
      return \Drupal::service('anu_comments.comment')->sendEmailNotification($output['message']);
    }
    catch (\Exception $exception) {

      \Drupal::logger('anu_events')
        ->critical('Could not send email notification. Error: @error', [
          '@error' => $exception->getMessage(),
        ]);
    }

    return TRUE;
  }
}
