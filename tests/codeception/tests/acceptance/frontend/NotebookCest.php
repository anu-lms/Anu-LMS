<?php

namespace frontend;

/**
 * Class NotebookCest
 *
 * @group frontend
 */
class NotebookCest {

  public function NotebookOperations(\Step\Acceptance\Learner $I) {

    $I->loginAsLearner();
    $I->seeElement('.header-icon.notebook');

    // Open notes page
    $I->click('.header-icon.notebook');
    $I->waitForText('My Notebook');
    $I->seeElement('.add-note');

    // Add note
    $I->click('.add-note');
    $I->waitForElement('.note-content h5.title .placeholder');
    $I->see('New Note', '.notes-list');
    $I->click('.note-content h5.title .placeholder');
    $I->pressKey('.note-content h5.title span', 'Note title');
    $I->wait(1);
    $I->see('Note title','.notes-list');

    // Edit note
    $I->click('//div[@class="notes-list"]//div[text()="Note title"]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " notes-list-item ")]');
    $I->waitForElement('.note-content h5.title');
    $I->wait(1); // sometimes waitForElement returns true too early, which result in "Other element would receive the click" error
    $I->click('.note-content h5.title');
    $I->pressKey('.note-content h5.title span', ' edited');
    $I->wait(1);
    $I->see('Note title edited','.notes-list');

    // Delete note
    $I->click('.context-menu button');
    $I->click('//div[@class="context-menu"]//div[@role="menu"]//span[@class="menu-icon menu-icon-delete"]/ancestor::div[@role="menuitem"]');
    $I->acceptPopup();
    $I->dontSee('Note title edited');

  }

}
