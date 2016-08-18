# Project variables
PROJECT_NAME ?= intake_accelerator
ORG_NAME ?= casecommons
REPO_NAME ?= intake_accelerator

# Filenames
TEST_COMPOSE_FILE := docker/test/docker-compose.yml

# Docker Compose Project Names
TEST_PROJECT := $(PROJECT_NAME)_test

INSPECT := $$(docker-compose -p $$1 -f $$2 ps -q $$3 | xargs -I ARGS docker inspect -f "{{ .State.ExitCode }}" ARGS)
CHECK := @bash -c '\
  if [[ $(INSPECT) -ne 0 ]]; \
  then exit $(INSPECT); fi' VALUE

.PHONY: test

test:
	${INFO} "Pulling latest images..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) pull
	${INFO} "Building images..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build --pull rspec_test
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build --pull lint
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build --pull javascript_test
	${INFO} "Running tests..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up rspec_test
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up lint
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up javascript_test 
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) rspec_test
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) lint
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) javascript_test
	${INFO} "Testing complete"

# Cosmetics
YELLOW := "\e[1;33m"
NC := "\e[0m"

# Shell Functions
INFO := @bash -c '\
  printf $(YELLOW); \
  echo "=> $$1"; \
  printf $(NC)' SOME_VALUE
