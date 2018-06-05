#!/usr/bin/env bash

# This script can be executed like `./local-update.sh dump.sql` to import the db during update.
# dump.sql should be placed in ./drupal/web/dump.sql.

local_project_path=./drupal/web/
docker_root=/var/www/html/web

# Install and update all Drupal components.
docker-compose run php composer install --verbose

# Searching for the file from the arguments if there are some.
if [ -n "$1" -a -f "${local_project_path}${1}" ];
  then
    echo "Importing database..."
    docker-compose exec --user=82:82 php drush --root=$docker_root sql-query --file="${1}"
fi

# Rebuild caches.
docker-compose exec --user=82:82 php sh -c "cd web && drush cr"

# Apply database updates.
docker-compose exec --user=82:82 php sh -c "cd web && drush updb -y"

# Import new configurations.
docker-compose exec --user=82:82 php sh -c "cd web && drush cim -y"

# Apply entity updates.
docker-compose exec --user=82:82 php sh -c "cd web && drush entup -y"

# Set the right permis for the cert keys.
docker-compose exec php sh -c "sudo chmod 660 keys/public.key keys/private.key"
docker-compose exec php sh -c "sudo chown 82:82 keys/public.key keys/private.key"

# Install and update all node.js packages.
docker-compose run node yarn install

# Restart docker containers.
docker-compose down
docker-compose up -d
