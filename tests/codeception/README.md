# Codeception Test Suites


## Executing tests

Just run the following command:

```
docker-compose run codecept run acceptance --debug
```

It will run all acceptance tests using chromedriver instance from codecept container.


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
docker-compose run codecept acceptance -g debug --debug
```

The command above will run tests from "debug" group only.


## Clean up

Delete previously stored artifacts:
```
docker-compose run codecept clean
```

Rebuild helper classes after major changes in test suite:
```
docker-compose run codecept build
```
