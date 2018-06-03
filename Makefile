.PHONY: default up pull up stop down exec

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


default: up

pull:
	@echo "Updating Docker images..."
	docker-compose pull

up: | pull
	@echo "Build and run containers..."
	docker-compose up -d --remove-orphans

stop:
	@echo "Stopping containers..."
	docker-compose stop

restart:
	@echo "Restarting containers..."
	docker-compose restart

down:
	@echo "Removing network & containers..."
	docker-compose down -v --remove-orphans

shell:
	docker-compose exec --user=82:82 php sh

cr:
	$(call docker-drupal, drush cr)

prepare: | prepare\:project prepare\:permissions

prepare\:project:
	@echo "Adding Platform.sh remote..."
	-$(shell platform project:set-remote ${PLATFORM_PROJECT_ID})

prepare\:permissions:
	@echo "Fixing directory permissions..."
	$(shell chmod 777 \.\/public\/sites\/default\/files)

install: | prepare up db\:dump reinstall

reinstall: | db\:import update

# todo: exclude unnecessary tables.
db\:dump:
	@echo "Creating DB dump..."
	-$(shell platform db:dump -y --project=${PLATFORM_PROJECT_ID} --environment=${PLATFORM_ENVIRONMENT} --app=backend --exclude-table=cache,cache_*,flood,watchdog --gzip --file=${BACKUP_DIR}/${PLATFORM_ENVIRONMENT}-dump.sql.gz)


# todo: Define aliases.

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
