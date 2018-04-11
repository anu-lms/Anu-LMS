<?php

namespace frontend;

use Codeception\Util\Locator;

/**
 * Class CourseCest
 *
 * @group frontend
 */
class CourseCest {

  public function viewCourseLandingPage(\Step\Acceptance\Learner $I) {

    $I->loginAsLearner();
    $I->scrollTo(['xpath' => Locator::contains('h4', 'Test Class')]);
    $I->clickWithLeftButton(['xpath' => Locator::href('/course/test-course')]);
    $I->waitForText('Test Course');
    $I->see('Start', 'a.btn');
    $I->see('Course Content');
    $I->see('Overview');

  }

}