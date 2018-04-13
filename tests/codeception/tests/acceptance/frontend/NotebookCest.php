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
    $I->seeElement('a.notebook');

    // Open notes page
    $I->click('a.notebook');
    $I->waitForText('My Notebook');
    $I->seeElement('.add-note');

    // Add note
    $I->click('.add-note');
    $I->waitForElement('.note-content');
    $I->see('New Note', '.notes-list');
    $I->click('.note-content h5.title .placeholder');
    $I->pressKey('.note-content h5.title span', 'Note title');
    //$I->see('Note title','.notes-list');
    //$I->click('.add-note');

  }

}