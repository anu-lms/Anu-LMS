<?php

namespace Drupal\anu_events\Event;

/**
 * Defines events for the anu events system.
 *
 * @see \Drupal\anu_events\Event\ReplyToCommentEvent
 * @see \Drupal\anu_events\Event\AddCommentToThreadEvent
 */
final class AnuEvents {

  /**
   * Name of the event fired when user reply to comment of another user.
   *
   * @Event
   *
   * @see \Drupal\anu_events\Event\ReplyToCommentEvent
   *
   * @var string
   */
  const REPLY_TO_COMMENT = 'anu_events.reply_to_comment';

  /**
   * Name of the event fired when user add a comment to the thread of another user.
   *
   * @Event
   *
   * @see \Drupal\anu_events\Event\AddCommentToThreadEvent
   *
   * @var string
   */
  const ADD_COMMENT_TO_THREAD = 'anu_events.add_comment_to_thread';

}
