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
    $I->switchToOrganization('Test Organization');

    // Check comments visibility as user of Org 1.
    $I->openVideoComments();
    $I->seeElement('#' . $this->comments[0]);
    $I->dontSeeElement('#' . $this->comments[1]);
  }

}
