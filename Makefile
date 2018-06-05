.PHONY: default up up stop restart down shell shell\:node cr prepare prepare\:project prepare\:permissions \
install reinstall db\:dump db\:dump\:local db\:import db\:import\:local update tests tests\:debug eslint cscheck csfix

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

# Defines colors for echo, eg: @echo "${GREEN}Hello World${COLOR_END}". More colors: https://stackoverflow.com/a/43670199/3090657
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

shell\:node:
	docker-compose exec node sh

cr:
	$(call docker-drupal, drush cr)

prepare:
	$(MAKE) -s prepare\:project
	$(MAKE) -s prepare\:permissions

prepare\:project:
	@echo "${YELLOW}Adding Platform.sh remote...${COLOR_END}"
	-$(shell platform project:set-remote ${PLATFORM_PROJECT_ID})

prepare\:permissions:
	@echo "${YELLOW}Fixing directory permissions...${COLOR_END}"
	$(shell chmod 777 \.\/public\/sites\/default\/files)

# Install rule wasn't tested. @todo: review and improve this part.
install:
	$(MAKE) -s prepare
	$(MAKE) -s up
	$(MAKE) -s db\:dump
	$(MAKE) -s reinstall

reinstall:
	$(MAKE) -s db\:import
	$(MAKE) -s update

db\:dump:
	@echo "${YELLOW}Creating DB dump...${COLOR_END}"
	$(shell platform db:dump -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=backend --exclude-table=cache,cache_*,flood,watchdog --gzip --file=drupal/${BACKUP_DIR}/${PLATFORM_ENVIRONMENT}-dump.sql.gz)

db\:dump\:local:
	@echo "${YELLOW}Creating DB dump...${COLOR_END}"
	$(call docker, drush sql-dump --gzip --result-file=../${BACKUP_DIR}/local-dump.sql --skip-tables-list=cache,cache_*,flood,watchdog)

db\:import:
	@echo "${YELLOW}Dropping DB...${COLOR_END}"
	$(call docker-drupal, drush sql-drop -y)

	@echo "${YELLOW}Importing ${PLATFORM_ENVIRONMENT} DB...${COLOR_END}"
	$(call docker-drupal, /bin/sh -c "zcat ${BACKUP_DIR}/${PLATFORM_ENVIRONMENT}-dump.sql.gz | drush sql-cli")

db\:import\:local:
	@echo "${YELLOW}Dropping DB...${COLOR_END}"
	$(call docker-drupal, drush sql-drop -y)

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

# Examples:
# make tests
# make tests frontend/DashboardCest.php:viewDashboard
tests:
#	Remove the first argument `tests` from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	@echo "${YELLOW}Running tests $(ARGS)...${COLOR_END}"
	docker-compose run codecept run acceptance $(ARGS) --debug

tests\:debug:
	docker-compose run codecept run acceptance --group debug --debug

eslint:
	@echo "${YELLOW}Analysing js code for the standats following...${COLOR_END}"
	docker-compose exec node yarn eslint

# Check custom modules in /modules/anu folder for coding standarts.
# Examples:
# make cscheck
# make cscheck anu_search
cscheck:
#	Remove the first argument `tests` from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	$(call docker, ./vendor/bin/phpcs --config-set installed_paths ../../drupal/coder/coder_sniffer)
	$(call docker, ./vendor/bin/phpcs --config-set show_progress 1)
	$(call docker, ./vendor/bin/phpcs --colors --warning-severity=0 --standard=Drupal ./web/modules/anu/$(ARGS))

# Fix issues with coding standarts in /modules/anu folder.
# Examples:
# make csfix
# make csfix anu_search
csfix:
#	Remove the first argument `tests` from the list of make commands.
	$(eval ARGS := $(filter-out $@,$(MAKECMDGOALS)))
	$(call docker, ./vendor/bin/phpcbf --colors --standard=Drupal ./web/modules/anu/$(ARGS))

# Defines short aliases.
# You can also add `alias mk='make'` to ~/.bash_profile (MacOS) to use short `mk` indead of `make`.
# `make` without arguments will run default `up` rule.
st: stop
rs: restart
dn: down
sh: shell
shn:
	$(MAKE) -s shell\:node
ins: install
ri: reinstall
dbd:
	$(MAKE) -s db\:dump
dbdl:
	$(MAKE) -s db\:dump\:local
dbi:
	$(MAKE) -s db\:import
dbil:
	$(MAKE) -s db\:import\:local
upd: update
td:
	$(MAKE) -s tests\:debug
el: eslint

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
