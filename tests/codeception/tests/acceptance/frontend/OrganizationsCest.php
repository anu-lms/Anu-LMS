<?php

namespace frontend;

/**
 * Class OrganizationsCest
 *
 * @group frontend
 */
class OrganizationsCest {

  private $comments;

  /**
   * @param \Step\Acceptance\Learner $I
   * @throws \Exception
   */
  public function SingleOrganization(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->see('Test Organization', '.site-header');
    $I->click('.icon-profile');
    $I->waitForText('Test Learner');
    $I->dontSee('Switch Organization');
  }

  /**
   * @param \Step\Acceptance\Learner $I
   * @throws \Exception
   */
  public function MultipleOrganizations(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner3();
    $I->see('Test Organization', '.site-header');
    $I->click('.icon-profile');
    $I->waitForText('Test Learner 3');
    $I->See('Switch Organization');
    $I->click('.switch-organization');
    $I->waitForText('Test Organization', null, '.organizations');
    $I->see('Test Organization 2');
    // Switch to Org 2.
    $I->click('//ul[@class="organizations"]//span[text()="Test Organization 2"]');
    $I->waitForText('Test Organization 2', null, '.site-header');

    // User from Organization 1.
    $learner = $I->haveFriend('learner', 'Step\Acceptance\Learner');
    $learner->does(function(\Step\Acceptance\Learner $I) {
      $I->loginAsLearner();
      $I->openVideoComments();
      // Create one comment.
      $this->comments = $I->createComments(1);
    });

    // User from Organization 2.
    $learner2 = $I->haveFriend('learner2', 'Step\Acceptance\Learner');
    $learner2->does(function(\Step\Acceptance\Learner $I) {
      $I->loginAsLearner2();
      $I->openVideoComments();
      // Create one comment.
      $this->comments = array_merge($this->comments, $I->createComments(1));
    });

    // Check comments visibility as user of Org 2.
    $I->openVideoComments();
    $I->seeElement('#' . $this->comments[1]);
    $I->dontSeeElement('#' . $this->comments[0]);

    // Switch back to Org 1.
    $I->click('.icon-profile');
    $I->waitForText('Test Learner 3');
    $I->click('.switch-organization');
    $I->waitForText('Test Organization', null, '.organizations');
    $I->click('//ul[@class="organizations"]//span[text()="Test Organization"]');
    $I->waitForText('Test Organization', null, '.site-header');

    // Check comments visibility as user of Org 1.
    $I->waitForElementLoaded('.add-new-comment');
    $I->seeElement('#' . $this->comments[0]);
    $I->dontSeeElement('#' . $this->comments[1]);
  }

  /**
   * @param \Step\Acceptance\Learner $I
   * @throws \Exception
   */
  public function NoOrganization(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner4();
    $I->seeElement('.site-logo.without-label');
    $I->click('.icon-profile');
    $I->waitForText('Test Learner 4');
    $I->dontSee('Switch Organization');

    // Add user to Test Organization.
    $manager = $I->haveFriend('manager', 'AcceptanceTester');
    $manager->does(function(\AcceptanceTester $I) {
      $I->backendLogin('moderator.test', 'password', TRUE);
      $I->amOnPage('/admin/user/999993/edit');
      $I->waitForText('authenticated4.test');
      $I->checkOption('input[value="9997"]');
      $I->click('Save');
      $I->waitForText('The changes have been saved.');
    });

    // Make sure user logged out.
    $I->reloadPage();
    $I->waitForText('Login');
    $I->loginAsLearner4();

    // Remove user from Test Organization.
    $manager->does(function(\AcceptanceTester $I) {
      $I->amOnPage('/admin/user/999993/edit');
      $I->waitForText('authenticated4.test');
      $I->uncheckOption('input[value="9997"]');
      $I->click('Save');
      $I->waitForText('The changes have been saved.');
    });

    // Make sure user logged out.
    $I->reloadPage();
    // @TODO: Uncomment line below once #159232824 is resolved.
    //$I->waitForText('Login');
  }

}
