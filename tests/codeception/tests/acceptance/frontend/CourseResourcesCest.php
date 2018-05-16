<?php

namespace frontend;

use \Codeception\Util\Locator;

/**
 * Class CourseResourcesCest
 *
 * @group frontend
 */
class CourseResourcesCest {

  public function viewCourseResources(\Step\Acceptance\Learner $I) {
    $I->loginAsLearner();
    $I->openTestCourseLanding();
    $I->see('View all Course Resources here');
    $I->click('View all Course Resources here');
    $I->waitForText('Course Resources', 10, 'h1');
    $I->click(Locator::contains('div.title', 'Sample PDF file'));
    $I->waitForText('SAMPLE PDF FILE');
  }

}