<?php

namespace frontend;

/**
 * Class DashboardCest
 *
 * @group frontend
 */
class DashboardCest {

  public function showDashboard(\Step\Acceptance\Learner $I) {

    $I->loginAsLearner();
    $I->see('Test Class', 'h4');
    $I->see('Test Course', 'h5 a');
    $I->see('View', '.card-body a.btn');

  }

}