#!/usr/bin/env bash

# Install and update all Drupal components.
docker-compose run php composer install --verbose

# Import all existing configs into the site.
docker-compose exec --user=82:82 php sh -c "cd web && drush cim -y"

# Clear all cache
docker-compose exec --user=82:82 php sh -c "cd web && drush cr"

# Set the right permis for the cert keys.
docker-compose exec php sh -c "sudo chmod 660 keys/public.key keys/private.key"
docker-compose exec php sh -c "sudo chown 82:82 keys/public.key keys/private.key"

# Install and update all node.js packages.
docker-compose run node yarn install

# Restart docker containers.
docker-compose down
docker-compose up -d