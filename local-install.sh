#!/usr/bin/env bash

# Folder for db dump.
base_path=./drupal/web/

# This script can be executed like `sh local-install.sh dump.sql` to import the db before install.
if [ -n "$1" ]
  then
    db_file_name=$1
  else
    db_file_name=""
fi

# Searching for the file from the arguments if there are some.
if [ ! -z "${db_file_name}" -a ! -f "${base_path}${db_file_name}" ]
  then
    echo "File $db_file_name was not found in $base_path"
    exit 0
fi

# Full Docker restart.
docker-compose down
docker-compose up -d

# Set to ignore file modes.
git config core.fileMode false

# Copy & prepare Drupal config with db credentials for local development.
cp -n ./drupal/web/sites/default/default.settings.local.php ./drupal/web/sites/default/settings.local.php

# Make files folder writable.
docker-compose exec php chmod -R 0777 web/sites/default/files

# Install all Drupal components.
docker-compose run php composer install

if [ ! -z "${db_file_name}" -a ! -f "${base_path}${db_file_name}"  ]
  then
    echo "Importing database..."
    docker-compose run php drush --root="./web" sql-query --file="${db_file_name}"
  else
    echo "Installing Drupal..."
    docker-compose run php drush --root="./web" si minimal --account-name=admin --account-pass=admin --account-mail=ev@systemseed.com -y
fi

# Set the right site uuid to match existing configs.
docker-compose run php drush --root="./web" cset system.site uuid 7fa85e74-8fa6-473c-8b84-91507f6d5093 -y

# Import all existing configs into the site.
docker-compose run php drush --root="./web" config-import -y

# Import config-split configs.
docker-compose run php drush --root="./web" config-import -y

# Install default content and then disable the module.
docker-compose run php drush --root="./web" drush en ssb_default_content
docker-compose run php drush --root="./web" pmu default_content hal

# Install all node.js packages.
docker-compose run node yarn install

# Restart docker containers.
docker-compose down
docker-compose up -d
