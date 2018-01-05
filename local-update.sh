#!/usr/bin/env bash

# Install and update all Drupal components.
docker-compose run php composer update --with-dependencies --verbose

# Import all existing configs into the site.
docker-compose run php drush --root="./web" config-import -y

# Clear all cache
docker-compose run php drush --root="./web" cr

# Install and update all node.js packages.
docker-compose run node yarn upgrade

# Restart docker containers.
docker-compose down
docker-compose up -d
