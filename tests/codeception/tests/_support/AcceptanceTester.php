<?php


/**
 * Inherited Methods
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method \Codeception\Lib\Friend haveFriend($name, $actorClass = NULL)
 *
 * @SuppressWarnings(PHPMD)
*/
class AcceptanceTester extends \Codeception\Actor {

  use _generated\AcceptanceTesterActions;

  public function login($name, $password) {

    $I = $this;

    // Logging in.
    $I->amOnPage('/');
    $I->fillField('Username', $name);
    $I->fillField('Password', $password);
    $I->click('Login');

    // Make sure authentication succeeded.
    $I->waitForElement('.card');

  }

  public function openTestCourseLanding() {

    $I = $this;

    $I->scrollTo('//h4[text()="Test Class"]/following-sibling::div[@class="row"]//a[text()="Test Course"]/ancestor::div[@class="card"]//a[text()="View"]');
    $I->click('//h4[text()="Test Class"]/following-sibling::div[@class="row"]//a[text()="Test Course"]/ancestor::div[@class="card"]//a[text()="View"]');
    $I->waitForText('Course Content');

  }

  public function resumeCourseFromLanding() {

    $I = $this;

    $courseTitle = $I->grabTextFrom('h4');

    $I->click('//a[text()="Start" or text()="Resume"]');
    $I->waitForText($courseTitle, 20, '.navigation');

  }

}
