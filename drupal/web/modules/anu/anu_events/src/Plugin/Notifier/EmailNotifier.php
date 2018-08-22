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
   * Returns TRUE if channel should be triggered.
   */
  public function shouldTrigger() {
    try {
      $bundle = $this->message->bundle();
      // Gets recipient object from the message entity.
      $recipient = $this->message->field_message_recipient->first()->get('entity')->getValue();
      if (in_array($bundle, ['add_comment_to_thread', 'reply_to_comment'])) {

        // Returns FALSE if user didn't set Notify if replied option.
        return (bool) $recipient->field_notify_if_replied->getString();
      }
      elseif ($bundle == 'mentioned_in_comment') {

        // Returns FALSE if user didn't set Notify if tagged option.
        return (bool) $recipient->field_notify_if_tagged->getString();
      }
    }
    catch (\Exception $exception) {
      \Drupal::logger('anu_events')
        ->critical('Could not execute shouldTrigger function. Error: @error', [
          '@error' => $exception->getMessage(),
        ]);
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function deliver(array $output = []) {

    try {
      // Use comment service to send email notification.
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
