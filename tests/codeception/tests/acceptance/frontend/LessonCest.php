<?php

namespace frontend;

/**
 * Class LessonCest
 *
 * @group frontend
 */
class LessonCest {

  public function viewLesson(\Step\Acceptance\Learner $I) {

    $I->loginAsLearner();
    $I->openTestCourseLanding();
    $I->resumeCourseFromLanding();
    $I->see('Course Content', '.table-of-contents');

  }

}