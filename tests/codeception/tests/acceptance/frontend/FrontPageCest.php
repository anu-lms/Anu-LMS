<?php

namespace frontend;

/**
 * Class FrontPageCest
 *
 * @group frontend
 */
class FrontPageCest {

  public function testGTM(\Step\Acceptance\Learner $I) {
    if (empty($_ENV['GTM_ID_DEV'])) {
      throw new \Exception("GTM_ID_DEV variable doesn't exists, make sure you've added it in .env.local file and in CI variables");
    }
    $GTM = $_ENV['GTM_ID_DEV'];

    $I->amOnPage('/');
    $I->expectTo('see GTM container on site in stage mode.');
    $I->seeInPageSource("id=$GTM");
    $I->seeInPageSource("gtm_preview=env-5");
    $I->waitForJS("return google_tag_manager['$GTM'] != undefined;");
  }

}
