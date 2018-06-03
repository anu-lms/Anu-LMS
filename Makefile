.PHONY: default up pull up stop down shell db\:drop db\:import tests

# Make sure the local file with docker-compose overrides exist.
$(shell ! test -e \.\/.docker\/docker-compose\.override\.yml && cat \.\/.docker\/docker-compose\.override\.default\.yml > \.\/.docker\/docker-compose\.override\.yml)

# Create a .env file if not exists and include default env variables.
$(shell ! test -e \.env && cat \.env.default > \.env)

# Make all variables from the file available here.
include .env

# Define two users for with different permissions within the container.
# docker-drupal is applicable only for php containers.
docker-drupal = docker-compose exec -T --user=82:82 php time ${1}
docker = docker-compose exec -T php time ${1}

# Defines colors for echo, eg: @echo "${GREEN}Hello World${COLOR_END}"
# more colors: https://stackoverflow.com/a/43670199/3090657
YELLOW=\033[0;33m
RED=\033[0;31m
GREEN=\033[0;32m
COLOR_END=\033[0;37m

default: up

up:
	@echo "${YELLOW}Build and run containers...${COLOR_END}"
	docker-compose up -d --remove-orphans

stop:
	@echo "${YELLOW}Stopping containers...${COLOR_END}"
	docker-compose stop

restart:
	@echo "${YELLOW}Restarting containers...${COLOR_END}"
	docker-compose restart

down:
	@echo "${YELLOW}Removing network & containers...${COLOR_END}"
	docker-compose down -v --remove-orphans

shell:
	docker-compose exec --user=82:82 php sh

cr:
	$(call docker-drupal, drush cr)

prepare: | prepare\:project prepare\:permissions

prepare\:project:
	@echo "${YELLOW}Adding Platform.sh remote...${COLOR_END}"
	-$(shell platform project:set-remote ${PLATFORM_PROJECT_ID})

prepare\:permissions:
	@echo "${YELLOW}Fixing directory permissions...${COLOR_END}"
	$(shell chmod 777 \.\/public\/sites\/default\/files)

install: | prepare up db\:dump reinstall

reinstall: | db\:import update

db\:dump:
	@echo "${YELLOW}Creating DB dump...${COLOR_END}"
	$(shell platform db:dump -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=backend --exclude-table=cache,cache_*,flood,watchdog --gzip --file=drupal/${BACKUP_DIR}/${PLATFORM_ENVIRONMENT}-dump.sql.gz)

db\:dump\:local:
	@echo "${YELLOW}Creating DB dump...${COLOR_END}"
	$(call docker, drush sql-dump --gzip --result-file=../${BACKUP_DIR}/local-dump.sql --skip-tables-list=cache,cache_*,flood,watchdog)

db\:drop:
	@echo "${YELLOW}Dropping DB...${COLOR_END}"
	$(call docker-drupal, drush sql-drop -y)

db\:import: | db\:drop
	sleep 5
	@echo "${YELLOW}Importing ${PLATFORM_ENVIRONMENT} DB...${COLOR_END}"
	$(call docker-drupal, /bin/sh -c "zcat ${BACKUP_DIR}/${PLATFORM_ENVIRONMENT}-dump.sql.gz | drush sql-cli")

db\:import\:local: | db\:drop
	sleep 5
	@echo "${YELLOW}Importing Local DB...${COLOR_END}"
	$(call docker-drupal, /bin/sh -c "zcat ${BACKUP_DIR}/local-dump.sql.gz | drush sql-cli")

update:
	@echo "${YELLOW}Updating the code from the git remote branch...${COLOR_END}"
# 	Use "| true" to skip errors if branch wasn't pushed to origin yet.
	@git pull origin $(shell git rev-parse --abbrev-ref HEAD) | true

# 	Frontend restart is not needed, because containers restart will
# 	trigger "yarn install" anyway.
	@echo "${YELLOW}Restarting Docker containers...${COLOR_END}"
	@docker-compose down --remove-orphans
	docker-compose pull
	docker-compose up -d --remove-orphans

	@echo "${YELLOW}Updating composer dependencies for the backend...${COLOR_END}"
	$(call docker, composer install)

	@echo "${YELLOW}Running flush caches, DB updates...${COLOR_END}"
	$(call docker-drupal, drush cr)
	$(call docker-drupal, drush updb -y)
	$(call docker-drupal, drush cim -y)
	$(call docker-drupal, drush entup -y)

# todo: Define aliases.

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
