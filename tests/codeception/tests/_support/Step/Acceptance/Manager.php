<?php

namespace Step\Acceptance;

class Manager extends \AcceptanceTester {

  public function loginAsManager() {

    $I = $this;
    $I->login('moderator.test', 'password');

  }

}