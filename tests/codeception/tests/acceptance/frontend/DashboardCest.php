<?php

namespace frontend;

/**
 * Class DashboardCest
 *
 * @group frontend
 */
class DashboardCest {

    public function loginAsUser(\AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->fillField('Username', 'authenticated.test');
        $I->fillField('Password', 'password');

        $I->click('Login');

        $I->waitForElement('.card');
        $I->see('Test Class', 'h4');
        $I->see('Test Course', 'h5 a');
        $I->see('View', '.card-body a.btn');
    }

}