<?php

namespace frontend;

/**
 * Class NotesLessonCest
 *
 * @group frontend
 */
class NotesLessonCest {

  public function LessonNotebookOperations(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openTestCourseLanding();
    $I->resumeCourseFromLanding();
    $I->seeElement('.add-note-button');

    // Open notes form
    $I->click('.add-note-button');
    $I->waitForElement('.note-content');
    $I->see('Discard and Close');

    // Add note
    $I->click('.note-content h5.title .placeholder');
    $I->pressKey('.note-content h5.title span', 'Note title');
    $I->see('Save and Close');
    $I->click('div.save-close');
    $I->waitForElementNotVisible('.lesson-notebook-wrapper');
    $I->wait(0.2); // it doesn't work consistently without this line :(

    // Open notes list
    $I->waitForElement('.add-note-button');
    $I->click('.add-note-button');
    $I->waitForText('All Notes');
    $I->click('.show-note-button');
    $I->waitForText('Note title');

    // Edit note
    $I->click('//div[@class="notes-list"]//div[text()="Note title"]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " notes-list-item ")]');
    $I->waitForElementVisible('.note-content h5.title');
    $I->click('.note-content h5.title');
    $I->pressKey('.note-content h5.title span', ' edited');
    // Make sure user can see correct saving status.
    $I->waitForText('Not saved');
    $I->waitForText('Saving...');
    $I->waitForText('Saved');
    $I->click('.show-note-button');
    $I->waitForText('Note title edited');

    // Delete note
    $I->click('//div[@class="notes-list"]//div[text()="Note title edited"]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " notes-list-item ")]');
    $I->waitForElement('.note-content');
    $I->click('.context-menu button');
    $I->click('//div[@class="context-menu"]//div[@role="menu"]//span[@class="menu-icon menu-icon-delete"]/ancestor::div[@role="menuitem"]');
    $I->acceptPopup();
    $I->waitForText('All Notes');
    $I->dontSee('Note title edited');
  }

}
