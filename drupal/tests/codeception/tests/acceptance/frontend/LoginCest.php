<?php

namespace frontend;

/**
 * Class LoginCest
 *
 * @group frontend
 */
class LoginCest {

  public function loginAsManager(\AcceptanceTester $I) {
    $I->amOnPage('/');
    $I->fillField('Username', 'moderator.test');
    $I->fillField('Password', 'password');

    $I->click('Login');

    $I->waitForElement('.card');
  }

}
