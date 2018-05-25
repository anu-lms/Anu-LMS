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

    $I->scrollTo('//h4[text()="Test Class"]
      /following-sibling::div[@class="row"]
      //a[text()="Test Course"]
      /ancestor::div[@class="card"]
      //a[text()="View"]'
    );
    $I->click('//h4[text()="Test Class"]
      /following-sibling::div[@class="row"]
      //a[text()="Test Course"]
      /ancestor::div[@class="card"]
      //a[text()="View"]'
    );
    $I->waitForText('Course Content');
  }

  public function openVideoComments() {
    $I = $this;

    $I->amOnPage('/course/test-course/lesson-1');
    // Wait for the page to be fully loaded.
    $I->waitForElementLoaded('.comments-cta');
    try {
      // Check if comments tab is already active.
      $I->seeElement('.lesson-sidebar.active-tab-comments');
    }
    catch (Exception $e) {
      // Open comments list of the first video paragraph.
      $I->click('//div[@class="lesson-content"]
      /div[contains(concat(" ", normalize-space(@class), " "), " video ")]
      //span[contains(concat(" ", normalize-space(@class), " "), " comments-cta ")]');
    }

    // Wait for the comments list to be fully loaded.
    $I->waitForElementLoaded('#new-comment-form');
  }

  public function resumeCourseFromLanding() {
    $I = $this;

    $courseTitle = $I->grabTextFrom('h4');

    $I->click('//a[text()="Start" or text()="Resume"]');
    $I->waitForText($courseTitle, 5, '.navigation');
  }

  /**
   * Creates certain number of test comments.
   * @param integer $count
   *  Number of comments to create.
   * @param [optional] $reply_to
   *  Comment text to reply to.
   * @return array $comments
   *  array of comments.
   * @throws Exception
   */
  public function createComments($count, $reply_to = null) {
    $I = $this;

    $comments = [];

    // Makes sure there is no active loading process.
    $I->waitForElementLoaded('.add-new-comment');

    for ($i=1; $i<=$count; $i++) {
      $comment_text = uniqid('Test comment ');

      if ($reply_to) {
        $xpath = $this->getCommentXpath($reply_to);
        $comment_button = $xpath . '//span[contains(concat(" ", normalize-space(@class), " "), " reply ")]';
        $comment_field = '#reply-comment-form textarea';
        $comment_submit = '#reply-comment-form button[type="submit"]';
      }
      else {
        $comment_button = '.add-new-comment';
        $comment_field = '#new-comment-form textarea';
        $comment_submit = '#new-comment-form button[type="submit"]';
      }

      $I->amGoingTo(($reply_to ? 'Reply with' : 'Create') . " comment #$i: $comment_text");

      if ($reply_to) {
        // Scroll to the Replied comment to click reply button.
        $I->scrollTo($xpath);
        $I->wait(1);

        // Move mouse over comment, because reply visible only on hover.
        $I->moveMouseOver($xpath);
        // Make sure we can see reply button
        $I->seeElement($comment_button);
      }

      // Click Add new comment or Reply button.
      $I->click($comment_button);

      // Make sure Add new comment or Reply forms are visible.
      $I->waitForElement($comment_field, 5);

      // Scroll to the New comment or Reply textarea field.
      $I->scrollTo($comment_field);
      $I->wait(1);

      $I->fillField($comment_field, $comment_text);
      // Make sure Submit button is clickable.
      $I->waitForElementChange($comment_submit, function(\Facebook\WebDriver\WebDriverElement $el) {
        return $el->isEnabled();
      }, 2);

      $I->click($comment_submit);

      // Wait while comment is saving.
      if ($reply_to) {
        // Wait until reply form disappear.
        $I->waitForElementNotVisible($comment_field, 5);
      }
      else {
        // Wait until submit button showing loading progress (disabled);
        $I->waitForElementChange($comment_submit, function(\Facebook\WebDriver\WebDriverElement $el) {
          return !$el->isEnabled();
        }, 5);
      }

      // Make sure comment has been added to the list.
      $I->waitForText($comment_text, 5);

      $I->comment("Added comment #$i with text: $comment_text.");

      $comments[] = array(
        'text' => $comment_text,
        'xpath' => $this->getCommentXpath($comment_text)
      );
    }

    return $comments;
  }

  public function deleteComment($comment_text) {
    $I = $this;

    $I->clickCommentMenuItem($comment_text, 'Delete Comment');
    // Accept deleting comment.
    $I->acceptPopup();
    // Wait for delete confirmation.
    $I->waitForText('Comment has been successfully deleted.');
  }

  public function clickCommentMenuItem($comment_text, $menu_item) {
    $I = $this;

    $xpath = $this->getCommentXpath($comment_text);
    // Open comment operations menu.
    $I->click( $xpath . '//div[@class="context-menu"]//button');
    // Wait for menu to be opened.
    $I->waitForElementVisible($xpath . '//div[@role="menu"]');
    // Click menu item.
    $I->click($xpath . '//div[@role="menuitem" and text()="' . $menu_item . '"]');
  }

  private function getCommentXpath($comment_text) {
    return '//div[@class="comment-body" and text()="' . $comment_text . '"]
      //ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
  }

  public function seePageHasElement($element, $wait = 5) {
    $I = $this;
    try {
      $I->waitForElementVisible($element, $wait);
    }
    catch (\Exception $e) {
      return false;
    }
    return true;
  }

  /**
   * Waits for element on the page.
   * Makes sure that throbber animation doesn't cover desired element.
   * @param $element
   * @param null $timeout
   *  Timeout in seconds.
   * @throws Exception
   */
  public function waitForElementLoaded($element, $timeout = 10) {
    $I = $this;

    //$loading_timeout = 10;
    $loading_time = 0;
    $wait_for_loading = 0.2;
    while ($I->seePageHasElement('.loader', $wait_for_loading) && $loading_time < $timeout) {
      $I->wait($wait_for_loading);
      $loading_time += $wait_for_loading;
    }

    // If there was no .loader we waited $wait_for_loading sec anyway.
    $loading_time = max($loading_time, $wait_for_loading);

    $I->comment("I've been waiting element $element loading for $loading_time seconds.");

    $I->waitForElement($element, $timeout);
  }

  public function getNotificationsCount() {
    $I = $this;

    $notifications_count = 0;

    // Check notifications counter
    try {
      $I->seeElement('.notifications-wrapper .amount');
      $notifications_count = $I->grabTextFrom('.notifications-wrapper .amount');
    }
    catch(Exception $e) {
      $notifications_count = 0;
    }

    return $notifications_count;
  }

}
