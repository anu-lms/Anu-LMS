<?php

namespace frontend;

/**
 * Class CommentsCest
 *
 * @group frontend
 */
class CommentsCest {

  public function LessonComments(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElement('.lesson-comments-scrollable');
    $I->click('.lesson-sidebar-container .tab.notes');
    $I->waitForElement('.notes-list-column.visible');
    $I->click('.lesson-sidebar-container .tab.comments');
    $I->waitForElement('.lesson-comments-scrollable');
  }

  public function LessonCommentOperations(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElementLoaded('#new-comment-form');

    // Create comment.
    $I->click('.add-new-comment');
    $I->fillField('#new-comment-form textarea', 'Test comment');
    $I->wait(1);
    // Approach below does not always work, so have to wait 1 sec :(
    // $I->waitForElement('//div[@id="new-comment-form"]/button[@type="submit" and not(@disabled)]');
    $I->click('#new-comment-form button[type="submit"]');
    $I->waitForElement('//div[@class="comment-body" and text()="Test comment"]');

    // Edit comment.
    $commentWrapper = '//div[@class="comment-body" and text()="Test comment"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
    $I->click( $commentWrapper . '//div[@class="context-menu"]//button');
    $I->waitForElement($commentWrapper . '//div[@role="menu"]');
    $I->click($commentWrapper . '//div[@role="menuitem" and text()="Edit Comment"]');
    $I->pressKey('#edit-comment-form textarea', ' (edited)');
    $I->click('#edit-comment-form button[type="submit"]');
    $I->waitForElement('//div[contains(concat(" ", normalize-space(@class), " "), " comment ")]//div[@class="comment-body" and text()="Test comment (edited)"]');

    // Delete comment.
    $commentWrapper = '//div[@class="comment-body" and text()="Test comment (edited)"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
    $I->click( $commentWrapper . '//div[@class="context-menu"]//button');
    $I->waitForElement($commentWrapper . '//div[@role="menu"]');
    $I->click($commentWrapper . '//div[@role="menuitem" and text()="Delete Comment"]');
    $I->acceptPopup();
    $I->waitForText('Comment has been successfully deleted.');
    $I->dontSeeElement($commentWrapper);
  }

  public function LessonCommentPermissions(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();

    // Teacher creates a comment.
    $teacher = $I->haveFriend('teacher', 'Step\Acceptance\Teacher');
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->loginAsTeacher();
      $I->amOnPage('course/test-course/lesson-1');
      $I->waitForElementLoaded('.comments-cta');
      $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
      $I->waitForElementLoaded('#new-comment-form');
      // Create comment.
      $I->click('.add-new-comment');
      $I->fillField('#new-comment-form textarea', 'Test comment by Teacher');
      $I->wait(1);
      $I->click('#new-comment-form button[type="submit"]');
      $I->waitForElement('//div[@class="comment-body" and text()="Test comment by Teacher"]');
    });

    $teachersCommentWrapper = '//div[@class="comment-body" and text()="Test comment by Teacher"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';

    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElement($teachersCommentWrapper);
    $I->click( $teachersCommentWrapper . '//div[@class="context-menu"]//button');
    $I->waitForElement($teachersCommentWrapper . '//div[@role="menu"]');
    $I->dontSeeElement($teachersCommentWrapper . '//div[@role="menuitem" and text()="Edit Comment"]');
    $I->dontSeeElement($teachersCommentWrapper . '//div[@role="menuitem" and text()="Delete Comment"]');

    // Teacher deletes a comment.
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->amOnPage('course/test-course/lesson-1');
      //$I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
      $I->waitForElementLoaded('#new-comment-form');
      // Delete comment.
      $commentWrapper = '//div[@class="comment-body" and text()="Test comment by Teacher"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
      $I->click( $commentWrapper . '//div[@class="context-menu"]//button');
      $I->waitForElement($commentWrapper . '//div[@role="menu"]');
      $I->click($commentWrapper . '//div[@role="menuitem" and text()="Delete Comment"]');
      $I->acceptPopup();
      $I->waitForText('Comment has been successfully deleted.');
    });
  }

  public function LessonCommentsThread(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElementLoaded('#new-comment-form');

    // Create comment.
    $I->click('.add-new-comment');
    // Make sure input is in focus
    $I->wait(1);
    $I->assertTrue($I->executeJS('return document.getElementById("new-comment-form").getElementsByTagName("textarea")[0] === document.activeElement'));
    $I->fillField('#new-comment-form textarea', 'Test comment');
    $I->wait(1);
    $I->click('#new-comment-form button[type="submit"]');
    $I->waitForElement('//div[@class="comment-body" and text()="Test comment"]');

    // Teacher replies to a comment.
    $teacher = $I->haveFriend('teacher', 'Step\Acceptance\Teacher');
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->loginAsTeacher();
      $I->amOnPage('course/test-course/lesson-1');
      $I->waitForElementLoaded('.comments-cta');
      $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
      $I->waitForElementLoaded('#new-comment-form');
      // Reply to a comment.
      $commentWrapper = '//div[@class="comment-body" and text()="Test comment"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
      $I->click($commentWrapper . '//span[contains(concat(" ", normalize-space(@class), " "), " reply ")]');
      // Make sure input is in focus
      $I->wait(1);
      $I->assertTrue($I->executeJS('return document.getElementById("reply-comment-form").getElementsByTagName("textarea")[0] === document.activeElement'));
      $I->fillField('#reply-comment-form textarea', 'Test reply by Teacher');
      $I->wait(1);
      $I->click('#reply-comment-form button[type="submit"]');
      $I->waitForElement('//div[@class="comment-body" and text()="Test reply by Teacher"]');
    });

    // Delete threaded comment
    $commentWrapper = '//div[@class="comment-body" and text()="Test comment"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded($commentWrapper);
    $I->click( $commentWrapper . '//div[@class="context-menu"]//button');
    $I->waitForElement($commentWrapper . '//div[@role="menu"]');
    $I->click($commentWrapper . '//div[@role="menuitem" and text()="Delete Comment"]');
    $I->acceptPopup();
    $I->waitForText('Comment has been successfully deleted.');
    $I->waitForElement('.comments-list .comment.deleted');

    // Delete last comment in a thread
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->amOnPage('course/test-course/lesson-1');
      // Delete comment.
      $commentWrapper = '//div[@class="comment-body" and text()="Test reply by Teacher"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
      $I->waitForElementLoaded($commentWrapper);
      $I->click( $commentWrapper . '//div[@class="context-menu"]//button');
      $I->waitForElement($commentWrapper . '//div[@role="menu"]');
      $I->click($commentWrapper . '//div[@role="menuitem" and text()="Delete Comment"]');
      $I->acceptPopup();
      $I->waitForText('Comment has been successfully deleted.');
      // @TODO: uncomment this once issue #157352838 is resolved.
      //$I->dontSeeElement('.comments-list .comment.deleted');
    });
  }

  public function LessonCommentlink(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElementLoaded('#new-comment-form');

    $I->createComments(7);

    $commentWrapper = '//div[@class="comment-body" and text()="Test comment 7"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
    $I->click( $commentWrapper . '//div[@class="context-menu"]//button');
    $I->waitForElement($commentWrapper . '//div[@role="menu"]');
    $I->click($commentWrapper . '//div[@role="menuitem" and text()="Copy link to comment"]');
    $I->waitForText('Link successfully copied.');

    // Is there a better way to get data from the clipboard?
    $I->pressKey('#new-comment-form textarea', array('ctrl', 'v'));
    $url = $I->grabValueFrom('#new-comment-form textarea');

    // Go to comment link
    $url = parse_url($url, PHP_URL_PATH) . '?' . parse_url($url, PHP_URL_QUERY);
    $I->amOnPage($url);
    $I->waitForElement('.comments-list .comment.highlighted');
  }

  public function CrossOrgComments(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->amOnPage('course/test-course/lesson-1');
    $I->waitForElementLoaded('.comments-cta');
    $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    $I->waitForElementLoaded('#new-comment-form');

    $I->createComments(1);

    // User from other organization.
    $learner2 = $I->haveFriend('learner2', 'Step\Acceptance\Learner');
    $learner2->does(function(\Step\Acceptance\Learner $I) {
      $I->loginAsLearner2();
      $I->amOnPage('course/test-course/lesson-1');
      $I->waitForElementLoaded('.comments-cta');
      $I->click('//div[@class="lesson-content"]/div[contains(concat(" ", normalize-space(@class), " "), " video ")]//span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
      $I->waitForElementLoaded('#new-comment-form');

      // Create comment.
      $commentWrapper = '//div[@class="comment-body" and text()="Test comment 1"]//ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
      $I->dontSeeElement($commentWrapper);
    });
  }

}