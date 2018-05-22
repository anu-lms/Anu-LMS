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

  /**
   * @param $name
   *  User name.
   * @param $password
   *  User password.
   * @param bool $replace_pass
   *  If different password is defined at CircleCI environment, use it instead of provided one.
   * @throws Exception
   */
  public function login($name, $password, $replace_pass = FALSE) {
    $I = $this;

    if ($replace_pass) {
      // Use different password at platform.sh.
      $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: $password;
    }

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
    $I->waitForText($courseTitle, 2, '.navigation');
  }

  public function findCommentWrapperXpath($commentText) {
    $commentWrapper = '//div[@class="comment-body" and text()="' . $commentText . '"]
      //ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';

    return $commentWrapper;
  }

  /**
   * Creates certain number of test comments.
   * @param integer $count
   *  Number of comments to create.
   * @param [optional] $comment
   *  Comment text to reply to.
   * @return array $comments
   *  array of comments.
   * @throws Exception
   */
  public function createComments($count, $comment = null) {
    $I = $this;

    $comments = array();

    for ($i=1; $i<=$count; $i++) {
      $comment_text = uniqid('Test comment ');

      if ($comment) {
        $commentWrapper = '//div[@class="comment-body" and text()="' . $comment . '"]
          //ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
        $comment_button = $commentWrapper . '//span[contains(concat(" ", normalize-space(@class), " "), " reply ")]';
        $comment_field = '#reply-comment-form textarea';
        $comment_submit = '#reply-comment-form button[type="submit"]';
      }
      else {
        $comment_button = '.add-new-comment';
        $comment_field = '#new-comment-form textarea';
        $comment_submit = '#new-comment-form button[type="submit"]';
      }

      $I->click($comment_button);
      $I->fillField($comment_field, $comment_text);
      $I->waitForElementChange($comment_submit, function(\Facebook\WebDriver\WebDriverElement $el) {
        return $el->isEnabled();
      }, 1);
      $I->click($comment_submit);
      $I->waitForElement('//div[@class="comment-body" and text()="' . $comment_text . '"]');

      $comments[] = $comment_text;
    }

    return $comments;
  }

  /**
   * Waits for element on the page.
   * Makes sure that throbber animation doesn't cover desired element.
   * @param $element
   * @param null $timeout
   *  Timeout in seconds.
   * @throws Exception
   */
  public function waitForElementLoaded($element, $timeout = 2) {
    $I = $this;
    try {
      $I->waitForElementVisible('.loader', 1);
      $I->waitForElementNotVisible('.loader', $timeout);
    }
    catch (Facebook\WebDriver\Exception\NoSuchElementException $e) {
     // If there is no loader - wait for element as usual.
      $I->comment('Loader animation was not found. Waiting for element as usual.');
    }

    $I->waitForElement($element);
  }

}
