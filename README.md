# Hosts

At the end of configuration journey you'll get the following hosts available:

| URL                                    | Name                |
| -------------------------------------- | ------------------- |
| http://app.docker.localhost            | ReactJS application |
| http://app.docker.localhost/admin/     | Drupal 8            |
| http://pma.docker.localhost            | PhpMyAdmin          |
| http://mailhog.docker.localhost        | Mailhog             |

# Installation

   ```
   sudo chmod +x ./local-install.sh 
   ./local-install.sh
   ```
   
   That's it! Now you can visit your applications using the URLs from the previous section.

## CLI to work with ReactJS application

To access all `npm` and `yarn` commands you can simply run shell inside of `node` Docker container:

```
docker-compose run node sh
```

Then use `npm` or `yarn` CLI as usual. For example, add a new package:

```
yarn add lodash
```

All you'll need to commit is the change to `package.json` and `package.json` files.

## CLI to work with Drupal application

To access CLI to manage Drupal, run shell inside of `php` Docker container:

```
docker-compose run php sh
```

Then run any command you need. It's possible to use `composer`, `drush`, `drupal`.

If you want to run a single command inside of the container then you don't have to run shell first. Just do it this way:

```
docker-compose run php composer require drupal/devel:~1.0
```

After that commit resulting `composer.json` and `composer.lock` files.

Note that Drush and Drupal Console have to be invoked inside of `web` folder, so you'll have to `cd web` first.

Alternatively, you might use the following command to run `drush` or `drupal` CLI outside of Docker container:
 
```
docker-compose run php drush --root="./web/" <COMMAND>
```

If this command seems to be too long to type every time, consider adding it to the list of your bash aliases:
 
```
alias dockerdrush=docker-compose run php drush --root="./web/"
```

Then you'll be able to do something like this:

```
dockerdrush cr
```
