<?php

namespace Step\Acceptance;

class Learner extends \AcceptanceTester {

  public function loginAsLearner() {
    $I = $this;

    // Use different password at platform.sh.
    $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: 'password';

    $I->login('authenticated.test', $password);
  }

  public function loginAsLearner2() {
    $I = $this;

    // Use different password at platform.sh.
    $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: 'password';

    $I->login('authenticated2.test', $password);
  }

}