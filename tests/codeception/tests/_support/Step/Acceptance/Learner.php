<?php

namespace Step\Acceptance;

class Learner extends \AcceptanceTester {

  public function loginAsLearner() {

    $I = $this;
    $I->login('authenticated.test', 'password');

  }

}