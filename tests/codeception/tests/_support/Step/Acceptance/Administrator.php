<?php

namespace Step\Acceptance;

class Administrator extends \AcceptanceTester {

  public function loginAsAdministrator() {

    $I = $this;
    $I->login('administrator.test', 'password');

  }

}