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

  public function loginAsLearner3() {
    $I = $this;
    $I->login('authenticated3.test', 'password', TRUE);
  }

  public function loginAsLearner4() {
    $I = $this;
    $I->login('authenticated4.test', 'password', TRUE);
  }

}