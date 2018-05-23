<?php

namespace frontend;

/**
 * Class NotificationsCest
 *
 * @group frontend
 */
class NotificationsCest {

  private $comments;
  private $notifications_counter;


  /**
   * @param \Step\Acceptance\Learner $I
   * @throws \Exception
   */
  public function CommentNotifications(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openVideoComments();

    // Create a comment.
    $this->comments = $I->createComments(1);

    // Check notifications counter.
    $this->notifications_counter = $I->getNotificationsCount();

    // Teacher replies to the comment.
    $teacher = $I->haveFriend('teacher', 'Step\Acceptance\Teacher');
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->loginAsTeacher();
      $I->openVideoComments();
      // Reply to the comment.
      $this->comments = array_merge($this->comments, $I->createComments(9, $this->comments[0]['text']));
    });

    // Check notifications counter.
    $I->waitForElementChange('.notifications-wrapper .amount', function(\Facebook\WebDriver\WebDriverElement $el) {
      return $el->getText() != $this->notifications_counter;
    }, 2);
    $new_counter = $I->grabTextFrom('.notifications-wrapper .amount');
    $I->assertEquals(9, $new_counter - $this->notifications_counter);
    $this->notifications_counter = $new_counter;

    // Open notifications panel.
    $I->click('.icon-bell');
    $I->waitForElementLoaded('.notifications-popup');

    // Mark single notification as read.
    $I->click('.notifications-popup .notifications-item.not-read:first-child');
    $this->notifications_counter = $this->notifications_counter -1;
    $counter = $I->grabTextFrom('.notifications-wrapper .amount');
    $I->assertEquals($this->notifications_counter, $counter);

    // Mark all notifications as read.
    $I->click('.notifications-popup .mark-as-read');
    $I->dontSeeElement('.notifications-wrapper .amount');

    // Click notification link.
    $I->click('.notifications-popup .notifications-item:first-child .title span');
    // Make sure that clicking notification link redirects to the comment.
    $I->waitForElementLoaded(end($this->comments)['xpath']);
    // Make sure comment is highlighted.
    $I->waitForElement('.comments-list .comment.highlighted');
  }

  /**
   * @depends CommentNotifications
   * @param \Step\Acceptance\Learner $I
   * @throws \Exception
   */
  public function CommentNotificationsInfiniteScroll(\Step\Acceptance\Learner $I){
    $I->loginAsLearner();

    // Test infinite scroll.
    $I->click('.icon-bell');
    $I->waitForElementLoaded('.notifications-popup');
    // Should see at least 8 notifications right away.
    $I->seeNumberOfElements('.notifications-item', [8, max($this->notifications_counter, 8)]);
    $scroll_height = max($this->notifications_counter, 8) * 95.5;
    $I->executeJS('document.querySelector(".notifications-popup .infinite-scroll-component").scrollTop += ' . $scroll_height . ';');
    $I->wait(2);
    $I->seeNumberOfElements('.notifications-item', [9, max($this->notifications_counter + 8, 16)]);
  }

}