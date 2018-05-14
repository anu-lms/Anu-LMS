<?php

namespace Step\Acceptance;

class Administrator extends \AcceptanceTester {

  public function loginAsAdministrator() {

    $I = $this;

    // Use different password at platform.sh.
    $password = isset($_ENV['TEST_USERS_PASS'])? $_ENV['TEST_USERS_PASS']: 'password';

    $I->login('administrator.test', $password);

  }

}