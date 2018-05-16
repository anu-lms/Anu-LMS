<?php

namespace Step\Acceptance;

class Learner extends \AcceptanceTester {

  public function loginAsLearner() {
    $I = $this;
    $I->login('authenticated.test', 'password', TRUE);
  }

  public function loginAsLearner2() {
    $I = $this;
    $I->login('authenticated2.test', 'password', TRUE);
  }

}