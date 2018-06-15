<?php

namespace frontend;

/**
 * Class SearchCest
 *
 * @group frontend
 */
class SearchCest {

  /**
   * @param \Step\Acceptance\Learner $I
   * @throws \Exception
   */
  public function Search(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();

    $I->openVideoComments();

    // Create a comment.
    $comments = $I->createComments(1);
    $id = $comments[0];
    // Get comment text.
    $text = $I->grabTextFrom("#$id .comment-body");
    // Get unique part of a comment text.
    $uuid = substr($text,-13);

    // Create a note.
    $I->click('.header-icon.notebook');
    $I->waitForText('My Notebook');
    $I->click('.add-note');
    $I->waitForElement('.note-content h5.title .placeholder');
    $I->wait(1); // Sometimes text is splitted between several notes without this timeout.
    $I->click('.note-content h5.title .placeholder');
    $note_text = uniqid();
    $I->pressKey('.note-content h5.title span', $note_text);
    $I->waitForText($note_text, null,'.notes-list');

    $I->amGoingTo('Search for "lesson"');
    $I->searchFor('lesson');
    // I should see only Lesson 1 and Lesson 2.
    $I->seeNumberOfElements('#search-results-list .search-item', 2);

    $I->amGoingTo('Search for "taking notes"');
    $I->searchFor('taking notes');
    // I should see only one "Taking Notes" item.
    $I->seeNumberOfElements('#search-results-list .search-item', 1);

    $I->amGoingTo('Search for "lesson 1"');
    $I->searchFor('lesson 1');
    $I->clickFirstSearchSuggestion();
    // Make sure we're at the lesson 1 page.
    $I->waitForText('Lesson 1', null, 'h1');

    // Search for media.
    $I->amGoingTo('Search for media at lesson 1');
    $I->searchFor('lesson 1');
    $I->click('//div[@id="search-tabs"]//span[text()="Media"]');
    $I->waitForElement('#search-results-list .search-item.media');
    $I->click('#search-results-list .search-item.media:first-child .thumbnails a:first-child');
    $I->waitForText('Lesson 1', null, 'h1');
    $I->waitForElement('.video.highlighted');

    // Search for pdf.
    $I->amGoingTo('Search for PDF resource');
    $I->searchFor('sample');
    $I->click('//div[@id="search-tabs"]//span[text()="Resources"]');
    $I->waitForElement('#search-results-list .search-item.media_resource');
    $I->click('#search-results-list .search-item.media_resource');
    $I->waitForText('Lesson 2', null, 'h1');
    $I->waitForElement('.resource.highlighted');

    // Search for own comment.
    $I->amGoingTo('Search for own comment');
    $I->searchFor($uuid);
    $I->clickFirstSearchSuggestion();
    // Make sure we're redirected to the comment.
    $I->waitForText("Test comment $uuid");

    // Search for own note.
    $I->amGoingTo('Search for own note');
    $I->searchFor($note_text);
    $I->clickFirstSearchSuggestion();
    // Make sure we're redirected to the note.
    $I->waitForText($note_text);
  }

}
