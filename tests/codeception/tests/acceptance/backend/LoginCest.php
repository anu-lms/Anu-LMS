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
    $I->fillField('Username', 'moderator.test');
    $I->fillField('Password', 'password');

    $I->click('Log in');
    $I->waitForText('Log Out', 10);

    $I->see('Add content', 'h2');
    $I->see('Edit content', 'h2');
  }

}
