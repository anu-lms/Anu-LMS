<?php

namespace frontend;

/**
 * Class CommentsCest
 *
 * @group frontend
 */
class CommentsCest {

  private $comments;

  public function LessonCommentOperations(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openVideoComments();

    // Switch to notes tab.
    $I->click('.lesson-sidebar-container .tab.notes');
    // Wait for notes to be fully loaded.
    $I->waitForElement('.notes-list-column.visible');
    // Switch back to comments.
    $I->click('.lesson-sidebar-container .tab.comments');
    // Wait for comments to be fully loaded.
    $I->waitForElementLoaded('.lesson-comments-scrollable');

    // CREATE A COMMENT.
    // Open comment creation form.
    $I->click('.add-new-comment');
    // Make sure input is in focus.
    $I->wait(1);
    $I->assertTrue($I->executeJS('return document.querySelector("#new-comment-form textarea") === document.activeElement'));
    // Create a comment.
    $this->comments = $I->createComments(1);

    // REPLY FORM.
    $I->click($this->comments[0]['xpath'] . '//span[contains(concat(" ", normalize-space(@class), " "), " reply ")]');
    // Make sure input is in focus
    $I->wait(1);
    $I->assertTrue($I->executeJS('return document.querySelector("#reply-comment-form textarea") === document.activeElement'));

    // EDIT COMMENT.
    // Open comment operations menu.
    $I->click( $this->comments[0]['xpath'] . '//div[@class="context-menu"]//button');
    // Wait for menu to be opened.
    $I->waitForElement($this->comments[0]['xpath'] . '//div[@role="menu"]');
    // Open comment editing form.
    $I->click($this->comments[0]['xpath'] . '//div[@role="menuitem" and text()="Edit Comment"]');
    // Edit comment.
    $I->pressKey('#edit-comment-form textarea', ' (edited)');
    // Save comment.
    $I->click('#edit-comment-form button[type="submit"]');
    // Update comment element.
    $this->comments[0] = array(
      'text' => $this->comments[0]['text'] . ' (edited)',
      'xpath' => '//div[@class="comment-body" and text()="' . $this->comments[0]['text'] . ' (edited)"]
        //ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]'
    );
    // Wait for comment to be updated.
    $I->waitForElement($this->comments[0]['xpath']);

    // DELETE COMMENT.
    $I->deleteComment($this->comments[0]['text']);
    // Check that comment is not in the list any more.
    $I->dontSeeElement($this->comments[0]['xpath']);
  }

  public function LessonCommentPermissions(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();

    // Teacher creates a comment.
    $teacher = $I->haveFriend('teacher', 'Step\Acceptance\Teacher');
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->loginAsTeacher();
      $I->openVideoComments();
      // Create a comment.
      $this->comments = $I->createComments(1);
    });

    // Check comment created by teacher.
    $I->openVideoComments();
    // Open comment operations menu.
    $I->click( $this->comments[0]['xpath'] . '//div[@class="context-menu"]//button');
    // Wait for menu to be opened.
    $I->waitForElement($this->comments[0]['xpath'] . '//div[@role="menu"]');
    // Check that edit and delete operations are not available.
    $I->dontSeeElement($this->comments[0]['xpath'] . '//div[@role="menuitem" and text()="Edit Comment"]');
    $I->dontSeeElement($this->comments[0]['xpath'] . '//div[@role="menuitem" and text()="Delete Comment"]');

    // Teacher deletes a comment.
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->openVideoComments();
      $I->deleteComment($this->comments[0]['text']);
    });
  }

  public function LessonCommentsThread(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openVideoComments();

    // Create a comment.
    $this->comments = $I->createComments(1);

    // Teacher replies to the comment.
    $teacher = $I->haveFriend('teacher', 'Step\Acceptance\Teacher');
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->loginAsTeacher();
      $I->openVideoComments();
      // Reply to the comment.
      $this->comments = array_merge($this->comments, $I->createComments(1, $this->comments[0]['text']));
    });

    // Delete threaded comment.
    $I->openVideoComments();
    $I->deleteComment($this->comments[0]['text']);
    // Make sure thread is not deleted.
    $I->waitForElement('.comments-list .comment.deleted');

    // Delete last comment in a thread.
    $teacher->does(function(\Step\Acceptance\Teacher $I) {
      $I->openVideoComments();
      $I->deleteComment($this->comments[1]['text']);
      // @TODO: uncomment this once issue #157352838 is resolved.
      //$I->dontSeeElement('.comments-list .comment.deleted');
    });
  }

  public function LessonCommentlink(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openVideoComments();

    // Create comments.
    $this->comments = $I->createComments(7);

    // Copy last comment link.
    $I->click( $this->comments[6]['xpath'] . '//div[@class="context-menu"]//button');
    $I->waitForElement($this->comments[6]['xpath'] . '//div[@role="menu"]');
    $I->click($this->comments[6]['xpath'] . '//div[@role="menuitem" and text()="Copy link to comment"]');
    $I->waitForText('Link successfully copied.');

    // @TODO: Is there a better way to get data from the clipboard?
    $I->pressKey('#new-comment-form textarea', array('ctrl', 'v'));
    $url = $I->grabValueFrom('#new-comment-form textarea');

    // Go to the comment link.
    $url = parse_url($url, PHP_URL_PATH) . '?' . parse_url($url, PHP_URL_QUERY);
    $I->amOnPage($url);

    // Make sure comment is highlighted.
    $I->waitForElement('.comments-list .comment.highlighted');
  }

  public function CrossOrgComments(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openVideoComments();

    $this->comments = $I->createComments(1);

    // User from other organization.
    $learner2 = $I->haveFriend('learner2', 'Step\Acceptance\Learner');
    $learner2->does(function(\Step\Acceptance\Learner $I) {
      $I->loginAsLearner2();
      $I->openVideoComments();
      // Make sure comment is not visible for another organization.
      $I->dontSeeElement($this->comments[0]['xpath']);
    });
  }

}