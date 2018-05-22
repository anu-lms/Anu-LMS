<?php

namespace frontend;

/**
 * Class NotificationsCest
 *
 * @group frontend
 */
class NotificationsCest {

  /*public function CommentNotifications(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElement('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElement('#new-comment-form');

    // Create comment.
    $I->click('.add-new-comment');
    $I->fillField('#new-comment-form textarea', 'Notifications test');
    $I->wait(1);
    $I->click('#new-comment-form button[type="submit"]');
    $I->waitForElement('//div[@class="comment-body" and text()="Notifications test"]');

    // Teacher replies to a comment.
    $teacher = $I->haveFriend('teacher', 'Step\Acceptance\Teacher');
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->loginAsTeacher();
      $I->amOnPage('course/test-course/lesson-1');
      $I->waitForElement('.comments-cta');
      $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
      $I->waitForElement('#new-comment-form');
      // Reply to a comment.
      $commentWrapper = '//div[@class="comment-body" and text()="Notifications test"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
      $I->createCommentReplies($commentWrapper, 7);
    });

    // Notifications check.
    $I->waitForElement('.notifications-wrapper .amount');
    $counter = $I->grabTextFrom('.notifications-wrapper .amount');
    $I->assertEquals(7, $counter);

    // Open notifications panel
    $I->click('.icon-bell');
    $I->waitForElement('.notifications-popup');

    // Mark single notification as read
    $I->click('.notifications-popup .notifications-item.not-read:first-child');
    $counter = $I->grabTextFrom('.notifications-wrapper .amount');
    $I->assertEquals(6, $counter);

    // Mark all notifications as read
    $I->click('.notifications-popup .mark-as-read');
    $I->dontSeeElement('.notifications-wrapper .amount');
  }*/
}