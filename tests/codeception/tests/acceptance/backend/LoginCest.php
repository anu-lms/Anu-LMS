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
    $I->fillField('Username', 'moderator.test');
    $I->fillField('Password', 'password');

    $I->click('Log in');
    $I->waitForText('Log Out');

    $I->see('Add content', 'h2');
    $I->see('Edit content', 'h2');
  }

}
