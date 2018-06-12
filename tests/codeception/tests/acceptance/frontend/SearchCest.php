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

    // Open search overlay.
    $I->click('.header-icon.search-bar');
    $I->waitForElementVisible('.lightbox .search-bar-container input[placeholder="Search"]');

    // Search for Lesson 1.
    $I->fillField('.lightbox .search-bar-container input[type="text"]', 'lesson 1');
    $I->amGoingTo('Wait for search results.');
    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) {
      $by = \Facebook\WebDriver\WebDriverBy::cssSelector('#search-results-list .list .search-item');
      $webdriver->wait(2)->until(
        \Facebook\WebDriver\WebDriverExpectedCondition::elementTextContains($by, 'Lesson 1')
      );
    });
    // Click first item of search output.
    $I->click('#search-results-list .search-item:first-child');
    // Make sure we're at the lesson 1 page.
    $I->waitForText('Lesson 1', null, 'h1');

    // Search for own comment.
    $I->amGoingTo('Search for own comment.');
    $I->click('.header-icon.search-bar');
    $I->waitForElementVisible('.lightbox .search-bar-container input[placeholder="Search"]');
    $I->fillField('.lightbox .search-bar-container input[type="text"]', $uuid);
    $I->amGoingTo('Wait for search results');
    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) use ($uuid) {
      $by = \Facebook\WebDriver\WebDriverBy::cssSelector('#search-results-list .list .search-item');
      $webdriver->wait(2)->until(
        \Facebook\WebDriver\WebDriverExpectedCondition::elementTextContains($by, $uuid)
      );
    });
    // Click first item of search output.
    $I->click('#search-results-list .search-item:first-child');
    // Make sure we're redirected to the comment.
    $I->waitForText("Test comment $uuid");

    // Search for own note.
    $I->amGoingTo('Search for own note.');
    $I->click('.header-icon.search-bar');
    $I->waitForElementVisible('.lightbox .search-bar-container input[placeholder="Search"]');
    $I->fillField('.lightbox .search-bar-container input[type="text"]', $note_text);
    $I->amGoingTo('Wait for search results');
    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) use ($note_text) {
      $by = \Facebook\WebDriver\WebDriverBy::cssSelector('#search-results-list .list .search-item');
      $webdriver->wait(2)->until(
        \Facebook\WebDriver\WebDriverExpectedCondition::elementTextContains($by, $note_text)
      );
    });
    // Click first item of search output.
    $I->click('#search-results-list .search-item:first-child');
    // Make sure we're redirected to the note.
    $I->waitForText($note_text);

  }

}
