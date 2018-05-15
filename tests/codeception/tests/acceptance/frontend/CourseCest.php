<?php

namespace frontend;

/**
 * Class CourseCest
 *
 * @group frontend
 */
class CourseCest {

  public function viewCourse(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openTestCourseLanding();
    $I->seeElement('//a[text()="Start" or text()="Resume"]');
    $I->see('Course Content');
    $I->see('Overview', 'h5');
  }

  public function toggleCourseNavigation(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openTestCourseLanding();
    $I->resumeCourseFromLanding();

    $I->seeElement('.navigation');
    $I->click('.collapsible-navigation .toggle');
    $I->wait(1);
    $I->dontSeeElement('.collapsible-navigation.opened');
    $I->click('.collapsible-navigation .toggle');
    $I->waitForElement('.navigation');
  }

}