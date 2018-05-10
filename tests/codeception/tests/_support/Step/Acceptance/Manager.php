<?php

namespace Step\Acceptance;

class Manager extends \AcceptanceTester {

  public function loginAsManager() {

    $I = $this;

    // Use different password at platform.sh.
    $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: 'password';

    $I->login('moderator.test', $password);

  }

}