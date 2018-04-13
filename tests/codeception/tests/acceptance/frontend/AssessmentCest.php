<?php

namespace frontend;

use \Helper\Acceptance;

/**
 * Class LessonCest
 *
 * @group frontend
 */
class AssessmentCest {

  public function Assessment(\Step\Acceptance\Learner $I) {

    $I->loginAsLearner();
    $I->openTestCourseLanding();
    $I->click(['link' => 'Assessment 1']);
    $I->waitForText('Assessment 1', null, 'h1');

    // Free answer.
    $I->fillField('//div[@class="title" and text()="Free answer question"]/following-sibling::textarea', 'Lorem ipsum');

    // Checkbox Question.
    $I->click('//label[text()="Checkbox Option 1"]');
    $I->click('//label[text()="Checkbox Option 3"]');

    // @TODO: Linear scale question
    //$I->dragAndDrop('#drag', '#drop');

    // Combobox Question.
    $I->click('//label[text()="Combo Option 2"]');

    // Submit assessment if it's not submitted yet.
    try {
      $I->click('//button[@type="submit"]');
      $I->waitForText('Thank you, the assessment has been successfully submitted.');
    } catch (\Exception $e) {
      // Otherwise do nothing
    }

    // Check resume
    $I->click('a[rel="home"]');
    $I->waitForText('Recent Courses');
    $I->click('//h4[text()="Recent Courses"]/following-sibling::div[@class="row"]//a[text()="Test Course"]/ancestor::div[@class="card"]//a[text()="Resume"]');
    $I->waitForText('Assessment 1', null,'h1');
    $I->see('Lorem ipsum', '//div[@class="title" and text()="Free answer question"]/following-sibling::textarea');
    $I->seeCheckboxIsChecked('//label[text()="Checkbox Option 1"]/preceding-sibling::input');
    $I->seeCheckboxIsChecked('//label[text()="Checkbox Option 3"]/preceding-sibling::input');

  }

}