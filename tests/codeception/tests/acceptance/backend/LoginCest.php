<?php

namespace backend;

/**
 * Class LoginCest
 *
 * @group backend
 */
class LoginCest {

  public function loginAsManager(\AcceptanceTester $I) {
    $I->amOnPage('/');
    $I->see('You must login to use this site.');

    // Use different password at platform.sh.
    $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: 'password';

    $I->fillField('Username', 'moderator.test');
    $I->fillField('Password', $password);

    $I->click('Log in');
    $I->waitForText('Log Out');

    $I->see('Add content', 'h2');
    $I->see('Edit content', 'h2');
  }

  public function loginAsLearner(\AcceptanceTester $I) {
    $I->amOnPage('/');
    $I->see('You must login to use this site.');

    // Use different password at platform.sh.
    $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: 'password';

    $I->fillField('Username', 'authenticated.test');
    $I->fillField('Password', $password);

    $I->click('Log in');
    $I->see('User authenticated.test is not allowed to access backend.', '.messages--error');
  }

}
