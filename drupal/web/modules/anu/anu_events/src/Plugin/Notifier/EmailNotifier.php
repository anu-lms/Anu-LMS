<?php

namespace Drupal\anu_events\Plugin\Notifier;

use Drupal\anu_normalizer\AnuNormalizerBase;

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

      // Load notification message.
      $message = AnuNormalizerBase::normalizeEntity($output['message'], ['lesson']);

      if (!$message) {
        throw new \Exception("Message entity can't be normalized.");
      }

      \Drupal::logger('anu_event222')->notice('aaaa');
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
