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

  /**
   * Creates certain number of test comments.
   * @param integer $count
   *   Number of comments to create.
   */
  public function createComments($count) {
    $I = $this;

    for ($i=1; $i<=$count; $i++) {
      $I->click('.add-new-comment');
      $I->fillField('#new-comment-form textarea', 'Test comment ' . $i);
      $I->wait(1);
      // Approach below does not always work, so have to wait 1 sec :(
      // $I->waitForElement('//div[@id="new-comment-form"]/button[@type="submit" and not(@disabled)]');
      $I->click('#new-comment-form button[type="submit"]');
      $I->waitForElement('//div[contains(concat(" ", normalize-space(@class), " "), " comment ")]//div[@class="comment-body" and text()="Test comment ' . $i . '"]');
    }
  }

  /**
   * Waits for element on the page.
   * Makes sure that throbber animation doesn't cover desired element.
   * @param $element
   * @param null $timeout
   *  Timeout in seconds.
   */
  public function waitForElementLoaded($element, $timeout = null) {
    $I = $this;
    try {
      $I->waitForElementVisible('.loader');
      $I->waitForElementNotVisible('.loader', $timeout);
    }
    catch (\Codeception\Exception\ElementNotFound $e) {
     // If there is no loader - wait for element as usual.
    }

    $I->waitForElement($element);
  }

}
