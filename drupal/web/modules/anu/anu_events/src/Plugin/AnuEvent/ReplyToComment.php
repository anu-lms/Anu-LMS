<?php

namespace Drupal\anu_events\Plugin\AnuEvent;

use Drupal\anu_events\AnuEventBase;

/**
 * Frontend Push notifier.
 *
 * @AnuEvent(
 *   id = "reply_to_comment",
 *   title = @Translation("Reply to comment"),
 *   description = @Translation("Triggered when user replied to the comment"),
 * )
 */
class ReplyToComment extends AnuEventBase {

}
