# Codeception Test Suites


## Prepare for local run and development

### Option 1: inside Docker

TBD.

### Option 2: without Docker

This option assumes you have PHP, Composer and chromedriver installed on your host machine.

[Download](https://sites.google.com/a/chromium.org/chromedriver/downloads) chromedriver and run it: 

```
./chromedriver --url-base=wd/hub --port=9515
```

Make sure all URLs inside of `codeception.yml` file are valid. You can run tests against 
your local installation (for example, `http://app.docker.localhost`) or against
remote Platform.sh site (https://stage-y77w3ti-lx26djloxt64m.us.platform.sh/).

Change working directory to `drupal` and run the following command:

```
./vendor/bin/codecept run acceptance -c tests/codeception --debug
```

It will run all acceptance tests in your local chromedriver instance.

## Tests structure

Acceptance test suite contains backend and frontend tests. -

- Backend tests should be stored in `acceptance/backend` and should page "backend" group (`@group backend`).
- Frontend tests should be stored in `acceptance/frontend` and should page "frontend" group (`@group frontend`).

Codeception will automatically use correct URL for each group of tests.

## Debugging a specific test

Add an extra "debug" group in test annotation:

```
  /**
   * @param \AcceptanceTester $I
   * @group debug
   */
  public function loginAsManager(\AcceptanceTester $I) {
  ...
```

Then run debug group only in Codeception:

```
./vendor/bin/codecept run acceptance -c tests/codeception -g debug --debug
```

The command above will run tests from "debug" group only.


## Clean up

Delete previously stored artifacts:
```
./vendor/bin/codecept -c tests/codeception clean
```

Rebuild helper classes after major changes in test suite:
```
./vendor/bin/codecept -c tests/codeception build
```
