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

  const TIMEOUT = null;

  /**
   * Authenticates user into the frontend.
   *
   * @param $name
   *   User name.
   * @param $password
   *   User password.
   * @param bool $replace_pass
   *   If different password is defined at CircleCI environment, use it instead of provided one.
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
    $I->waitForElement('.site-header');
  }

  /**
   * Authenticates user into the backend.
   *
   * @param $name
   *   User name.
   * @param $password
   *   User password.
   * @param bool $replace_pass
   *   If different password is defined at CircleCI environment, use it instead of provided one.
   * @throws Exception
   */
  public function backendLogin($name, $password, $replace_pass = FALSE) {
    $I = $this;

    if ($replace_pass) {
      // Use different password at platform.sh.
      $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: $password;
    }

    // Logging in.
    $I->amOnPage('/admin/user/login');
    $I->fillField('Username', $name);
    $I->fillField('Password', $password);
    $I->click('Log in');

    // Make sure authentication succeeded.
    $I->waitForText('To the site');
  }


  /**
   * Opens Test Course landing page from the dashboard.
   *
   * @throws Exception
   */
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

  /**
   * Opens comments section of the first video paragraph within Lesson 1.
   *
   * @throws Exception
   */
  public function openVideoComments() {
    $I = $this;

    $I->amOnPage('/course/test-course/lesson-1');
    $I->moveMouseOver('#paragraph-9991191 .comments-cta');

    // Wait for the page to be fully loaded.
    $I->waitForElementClickable('#paragraph-9991191 .comments-cta');
    try {
      // Check if comments tab is already active.
      $I->seeElement('.lesson-sidebar.active-tab-comments');
    }
    catch (Exception $e) {
      // Open comments list of the first video paragraph.
      $I->click('#paragraph-9991191 .comments-cta');
    }

    // Wait for the comments list to be fully loaded.
    $I->waitForElementLoaded('.add-new-comment');
  }

  /**
   * Pressing Start or Resume button at course landing page.
   *
   * @throws Exception
   */
  public function resumeCourseFromLanding() {
    $I = $this;

    $courseTitle = $I->grabTextFrom('h4');

    $I->click('//a[text()="Start" or text()="Resume"]');
    $I->waitForText($courseTitle, self::TIMEOUT, '.navigation');
  }

  /**
   * Creates certain number of test comments.
   *
   * @param integer $count
   *  Number of comments to create.
   * @param [optional] $comment_id
   *  Comment id to reply to.
   * @return array $comments
   *  array of comments.
   * @throws Exception
   */
  public function createComments($count, $comment_id = null) {
    $I = $this;

    $comments = [];

    // Makes sure there is no active loading process.
    $I->waitForElementClickable('.add-new-comment');

    for ($i=1; $i<=$count; $i++) {
      $comment_text = uniqid('Test comment ');

      if ($comment_id) {
        $comment_button = "#$comment_id .reply";
        $comment_field = '#reply-comment-form textarea';
        $comment_submit = '#reply-comment-form button[type="submit"]';
      }
      else {
        $comment_button = '.add-new-comment';
        $comment_field = '#new-comment-form textarea';
        $comment_submit = '#new-comment-form button[type="submit"]';
      }

      $I->amGoingTo(($comment_id ? 'Reply with' : 'Create') . " comment #$i: $comment_text");

      // Click Add new comment or Reply button.
      $I->scrollAndClick($comment_button);

      // Make sure that input field is ready for interaction.
      $I->scrollAndClick($comment_field);

      // Fill in comment text.
      $I->fillField($comment_field, $comment_text);

      // Make sure Submit button is clickable.
      $I->waitForElementChange($comment_submit, function(\Facebook\WebDriver\WebDriverElement $el) {
        return $el->isEnabled();
      });

      // Submit comment.
      $I->scrollAndClick($comment_submit);

      // Wait while comment is saving.
      if ($comment_id) {
        // Wait until reply form disappear.
        $I->waitForElementNotVisible($comment_field, self::TIMEOUT);
      }
      else {
        // Wait until submit button showing loading progress (disabled).
        $I->waitForElementChange($comment_submit, function(\Facebook\WebDriver\WebDriverElement $el) {
          return !$el->isEnabled();
        }, self::TIMEOUT);
      }

      // Make sure comment has been added to the list.
      $I->waitForText($comment_text, self::TIMEOUT);
      $xpath = $this->getCommentXpath($comment_text);

      // Wait for fadein animation to finish.
      $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) use ($xpath) {
        $by = $this->getLocator($xpath);
        $webdriver->wait()->until(WebDriverExpectedCondition::visibilityOfElementLocated($by));
      });

      $I->comment("Added comment #$i with text: $comment_text.");

      $id = $I->grabAttributeFrom($xpath, 'id');

      $comments[] = $id;
    }

    return $comments;
  }

  /**
   * Deletes comment.
   *
   * @param $comment_text
   * @throws Exception
   */
  public function deleteComment($comment_id) {
    $I = $this;

    $I->clickCommentMenuItem($comment_id, 'delete');
    // Accept deleting comment.
    $I->acceptPopup();
    // Wait for delete confirmation.
    $I->waitForText('Comment has been successfully deleted.');
  }

  /**
   * Clicks comment's contextual menu item by comment text and menu item class.
   *
   * @param $comment_text
   * @param $menu_item
   * @throws Exception
   */
  public function clickCommentMenuItem($comment_id, $menu_item) {
    $I = $this;

    // Open comment operations menu.
    $I->click( "#$comment_id .context-menu button");
    // Wait for menu to be opened.
    $I->waitForElementVisible("#$comment_id div[role='menu']");
    // Click menu item.
    $I->click("#$comment_id div[role='menu'] .$menu_item");
  }

  /**
   * Gets xPath selector of a comment by it's text.
   *
   * @param $comment_text
   * @return string
   */
  private function getCommentXpath($comment_text) {
    return '//div[@class="comment-body" and text()="' . $comment_text . '"]
      //ancestor::div[contains(concat(" ", normalize-space(@class), " "), " comment ")]';
  }

  /**
   * Waits for element to appear on the page.
   *
   * @param $el
   * @param int $timeout
   * @return bool
   */
  public function seePageHasElement($el, $timeout = self::TIMEOUT) {
    $I = $this;
    try {
      $I->waitForElementVisible($el, $timeout);
    }
    catch (\Exception $e) {
      return false;
    }
    return true;
  }

  /**
   * Waits for element on the page.
   *
   * Makes sure that throbber animation doesn't cover desired element.
   *
   * @param $element
   * @param null $timeout
   *  Timeout in seconds.
   * @throws Exception
   */
  public function waitForElementLoaded($el, $timeout = self::TIMEOUT) {
    $I = $this;

    $I->amGoingTo("Wait until $el is loaded.");

    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) use ($el, $timeout) {
      try {
        // Locator for loading animation.
        $by = $this->getLocator('.loader');
        // Wait for .loader to appear.
        $webdriver->wait()->until(WebDriverExpectedCondition::visibilityOfElementLocated($by));
        // Wait for .loader to disappear.
        $webdriver->wait($timeout)->until(WebDriverExpectedCondition::invisibilityOfElementLocated($by));
      }
      catch (Exception $e) {
        // If there is no loader - wait as usual.
      }
      // Locator for target element.
      $by = $this->getLocator($el);
      // Make sure desired element is loaded.
      $webdriver->wait($timeout)->until(WebDriverExpectedCondition::visibilityOfElementLocated($by));
    });
  }

  /**
   * An expectation for checking an element is visible and enabled such that you can click it.
   *
   * @param $el
   * @param int $timeout
   */
  public function waitForElementClickable($el, $timeout = self::TIMEOUT) {
    $I = $this;

    $I->amGoingTo("Wait until $el is clickable.");

    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) use ($el, $timeout) {
      $by = $this->getLocator($el);
      $webdriver->wait($timeout)->until(WebDriverExpectedCondition::elementToBeClickable($by));
    });
  }

  /**
   * Gets instance of WebDriverBy by selector.
   *
   * Have to use this because \Facebook\WebDriver::getLocator is protected.
   *
   * @param $selector
   * @return \Facebook\WebDriver\WebDriverBy
   * @throws \InvalidArgumentException
   */
  protected function getLocator($selector) {
    if ($selector instanceof \Facebook\WebDriver\WebDriverBy) {
      return $selector;
    }
    if (is_array($selector)) {
      return $this->getStrictLocator($selector);
    }
    if (Codeception\Util\Locator::isID($selector)) {
      return WebDriverBy::id(substr($selector, 1));
    }
    if (Codeception\Util\Locator::isCSS($selector)) {
      return WebDriverBy::cssSelector($selector);
    }
    if (Codeception\Util\Locator::isXPath($selector)) {
      return WebDriverBy::xpath($selector);
    }
    throw new \InvalidArgumentException("Only CSS or XPath allowed");
  }

  /**
   * Gets instance of WebDriverBy by strict selector.
   *
   * Have to use this because \Facebook\WebDriver::getStrictLocator is protected.
   *
   * @param array $by
   * @return \Facebook\WebDriver\WebDriverBy
   */
  protected function getStrictLocator(array $by) {
    $type = key($by);
    $locator = $by[$type];
    switch ($type) {
      case 'id':
        return WebDriverBy::id($locator);
      case 'name':
        return WebDriverBy::name($locator);
      case 'css':
        return WebDriverBy::cssSelector($locator);
      case 'xpath':
        return WebDriverBy::xpath($locator);
      case 'link':
        return WebDriverBy::linkText($locator);
      case 'class':
        return WebDriverBy::className($locator);
      default:
        throw new Codeception\Exception\MalformedLocatorException(
          "$by => $locator",
          "Strict locator can be either xpath, css, id, link, class, name: "
        );
    }
  }

  /**
   * Opens search overlay by clicking search bar.
   */
  public function openSearchOverlay() {
    $I = $this;

    $I->click('.header-icon.search-bar');
    $I->waitForElementVisible('.lightbox .search-bar-container input[placeholder="Search"]');
  }

  /**
   * Performs website search.
   *
   * @param $text
   *   search string.
   */
  public function searchFor($text) {
    $I = $this;

    try {
      // Check if search overlay is already active.
      $I->seeElement('.lightbox .search-bar-container input[type="text"]');
    }
    catch (Exception $e) {
      // Open search overlay.
      $I->openSearchOverlay();
    }

    $I->fillField('.lightbox .search-bar-container input[type="text"]', $text);
    $I->amGoingTo('Wait for search results.');
    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) {
      $by = \Facebook\WebDriver\WebDriverBy::cssSelector('#search-results-list .list .search-item');
      $webdriver->wait()->until(
        \Facebook\WebDriver\WebDriverExpectedCondition::visibilityOfElementLocated($by)
      );
    });
  }

  /**
   * Performs click on the first item from the search output.
   */
  public function clickFirstSearchSuggestion() {
    $I = $this;

    $I->amGoingTo('Click first search suggestion');
    $I->click('#search-results-list .search-item:first-child');
  }


  /**
   * Scrolls to element and clicks it.
   *
   * More reliable method for clicking elements.
   *
   * @param $selector
   */
  public function scrollAndClick($selector) {
    $I = $this;

    $I->scrollTo($selector);
    $I->moveMouseOver($selector);
    $I->waitForElementClickable($selector);

    $I->executeInSelenium(function(\Facebook\WebDriver\Remote\RemoteWebDriver $webdriver) use ($selector) {
      $by = $this->getLocator($selector);
      $el = $webdriver->findElements($by);
      $webdriver->executeScript('arguments[0].click();', $el);
    });
  }

  /**
   * Gets amount of unread notifications from the header.
   *
   * @return int
   *   Amount of notifications.
   */
  public function getNotificationsCount() {
    $I = $this;

    // Check notifications count.
    try {
      $I->seeElement('.notifications-wrapper .amount');
      $notifications_count = $I->grabTextFrom('.notifications-wrapper .amount');
    }
    catch(Exception $e) {
      $notifications_count = 0;
    }

    return $notifications_count;
  }

  /**
   * Gets amount of comments of a paragraph.
   *
   * @param $id
   *   Paragraph id.
   * @return int
   *   Amount of comments.
   */
  public function getCommentsCount($id) {
    $I = $this;

    $id = is_numeric($id) ? "paragraph-$id" : $id;

    // Check comments count.
    try {
      $count = $I->grabTextFrom("#$id .amount");
    }
    catch(Exception $e) {
      $count = 0;
    }

    return $count;
  }

  /**
   * Switching user to different organization by name.
   *
   * @param $org_name string
   *   Organization name.
   * @throws Exception
   */
  public function switchToOrganization($org_name) {
    $I = $this;

    try {
      // Check if profile dropdown is active.
      $I->seeElement('.profile-menu-list');
    }
    catch (Exception $e) {
      // Open profile dropdown.
      $I->click('.icon-profile');
    }

    $I->waitForText('Logout');
    $I->click('.switch-organization');
    $I->waitForText($org_name, null, '.organizations');
    $I->click('//ul[@class="organizations"]//span[text()="' . $org_name . '"]');
    $I->waitForText($org_name, null, '.site-header');
  }

}
