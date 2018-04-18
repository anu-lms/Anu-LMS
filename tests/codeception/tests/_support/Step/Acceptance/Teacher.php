<?php

namespace Step\Acceptance;

class Teacher extends \AcceptanceTester {

  public function loginAsTeacher() {

    $I = $this;
    $I->login('teacher.test', 'password');

  }

}