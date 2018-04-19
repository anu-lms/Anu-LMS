<?php

namespace frontend;

/**
 * Class FrontPageCest
 *
 * @group frontend
 */
class FrontPageCest {

  public function testGTM(\Step\Acceptance\Learner $I) {

    $I->amOnPage('/');
    $GTM = $_ENV['GTM_ID_DEV'];
    codecept_debug($_ENV);

    $I->expectTo('see GTM container on site in stage mode.');
    $I->seeInPageSource("id=$GTM");
    $I->seeInPageSource("gtm_preview=env-5");
    $I->waitForJS("return google_tag_manager['$GTM'] != undefined;");
  }

}
