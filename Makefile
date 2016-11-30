# Project variables
PROJECT_NAME ?= intake_accelerator
ORG_NAME ?= cwds
REPO_NAME ?= intake

export HTTP_PORT ?= 81
export APP_VERSION ?= 1.$(GIT_HASH)

include Makefile.settings

.PHONY: test build release clean tag buildtag login logout publish

version:
	@ echo $(APP_VERSION)

test:
	${INFO} "Pulling latest images..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) pull
	${INFO} "Building images..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build --pull rspec_test
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build --pull lint
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build --pull javascript_test
	${INFO} "Running tests..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up rspec_test
	@ docker cp $$(docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) ps -q rspec_test):/reports/. reports
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up lint
	@ docker cp $$(docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) ps -q lint):/reports/. reports
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up javascript_test
	@ docker cp $$(docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) ps -q javascript_test):/reports/. reports
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) rspec_test
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) lint
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) javascript_test
	${INFO} "Testing complete"

build:
	${INFO} "Creating builder image..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) build builder
	${INFO} "Building application artifacts..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) up builder
	${CHECK} $(TEST_PROJECT) $(TEST_COMPOSE_FILE) builder
	${INFO} "Copying application artifacts..."
	@ docker cp $$(docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) ps -q builder):/build_artefacts/. release
	${INFO} "Build complete"

release:
	${INFO} "Pulling latest images..."
	@ docker-compose -p $(REL_PROJECT) -f $(REL_COMPOSE_FILE) pull
	${INFO} "Building images..."
	@ docker-compose -p $(REL_PROJECT) -f $(REL_COMPOSE_FILE) build app
	@ docker-compose -p $(REL_PROJECT) -f $(REL_COMPOSE_FILE) build --pull nginx
	@ docker-compose -p $(REL_PROJECT) -f $(REL_COMPOSE_FILE) up -d nginx
	${INFO} "Release image build complete"

clean:
	${INFO} "Deleting application release artifacts..."
	@ rm -rf release
		${INFO} "Destroying development environment..."
	@ docker-compose -p $(TEST_PROJECT) -f $(TEST_COMPOSE_FILE) down --volumes
	${INFO} "Destroying release environment..."
	@ docker-compose -p $(REL_PROJECT) -f $(REL_COMPOSE_FILE) down --volumes
	${INFO} "Removing local images..."
	@ docker images -q -f label=application=$(PROJECT_NAME) | sort -u | xargs -I ARGS docker rmi -f ARGS
	${INFO} "Clean complete"

tag:
	${INFO} "Tagging release image with tags $(TAG_ARGS)..."
	@ $(foreach tag,$(TAG_ARGS), docker tag $(IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME):$(tag);)
	${INFO} "Tagging complete"

buildtag:
	${INFO} "Tagging release image with suffix $(BUILD_TAG) and build tags $(BUILDTAG_ARGS)..."
	@ $(foreach tag,$(BUILDTAG_ARGS), docker tag $(IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME):$(tag).$(BUILD_TAG);)
	${INFO} "Tagging complete"

login:
	${INFO} "Logging in to Docker registry $$DOCKER_REGISTRY..."
	@ docker login -u $$DOCKER_USER -p $$DOCKER_PASSWORD $(DOCKER_REGISTRY_AUTH)
	${INFO} "Logged in to Docker registry $$DOCKER_REGISTRY"

logout:
	${INFO} "Logging out of Docker registry $$DOCKER_REGISTRY..."
	@ docker logout
	${INFO} "Logged out of Docker registry $$DOCKER_REGISTRY"

publish:
	${INFO} "Publishing release image $(IMAGE_ID) to $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME)..."
	@ $(foreach tag,$(shell echo $(REPO_EXPR)), docker push $(tag);)
	${INFO} "Publish complete"

# Make will not attempt to evaluate arguments passed tasks as targets
%:
	@: