<?php

namespace Step\Acceptance;

class Teacher extends \AcceptanceTester {

  public function loginAsTeacher() {
    $I = $this;

    // Use different password at platform.sh.
    $password = isset($_ENV["TEST_USERS_PASS"])? $_ENV["TEST_USERS_PASS"]: 'password';

    $I->login('teacher.test', $password);
  }

}