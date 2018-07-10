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
    $I->click('.lesson-navigation-button .toggle');
    $I->waitForElementNotVisible('.collapsible-navigation.opened');
    $I->click('.lesson-navigation-button .toggle');
    $I->waitForElement('.navigation');
  }

}
