<?php

namespace frontend;

/**
 * Class FrontPageCest
 *
 * @group frontend
 */
class FrontPageCest {

  public function testGTM(\Step\Acceptance\Learner $I) {
    // Try to load GTM_ID from CI variables or use Default GTM id otherwise.
    $GTM_ID = !empty($_ENV['GTM_ID']) ? $_ENV['GTM_ID'] : 'GTM-TQKXJR8';

    $I->amOnPage('/');
    $I->expectTo('see GTM container on site in stage mode.');
    $I->seeInPageSource("id=$GTM_ID");
    $I->seeInPageSource("gtm_preview=env-5");
    $I->waitForJS("return google_tag_manager['$GTM_ID'] != undefined;");
  }

}
