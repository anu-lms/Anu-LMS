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

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
