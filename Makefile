# Project variables
PROJECT_NAME ?= intake_accelerator
ORG_NAME ?= cwds
REPO_NAME ?= intake

# DOCKER_REGISTRY ?= 429614120872.dkr.ecr.us-west-2.amazonaws.com
# AWS_ACCOUNT_ID ?= 429614120872
# DOCKER_LOGIN_EXPRESSION := eval $$(aws ecr get-login --registry-ids $(AWS_ACCOUNT_ID))

export HTTP_PORT ?= 81
export APP_VERSION ?= 1.$(GIT_HASH)

include Makefile.settings

.PHONY: test build release clean tag buildtag login logout publish

version:
	@ echo $(APP_VERSION)

test:
	${INFO} "Pulling latest images..."
	@ docker-compose $(TEST_ARGS) pull
	${INFO} "Building images..."
	@ docker-compose $(TEST_ARGS) build rspec_test &
	@ docker-compose $(TEST_ARGS) build lint &
	@ docker-compose $(TEST_ARGS) build javascript_test &
	@ wait
	${INFO} "Running lint..."
	@ docker-compose $(TEST_ARGS) up lint
	@ docker cp $$(docker-compose $(TEST_ARGS) ps -q lint):/reports/. reports
	@ $(call check_exit_code,$(TEST_ARGS),lint)
	${INFO} "Running tests..."
	@ docker-compose $(TEST_ARGS) up rspec_test
	@ docker cp $$(docker-compose $(TEST_ARGS) ps -q rspec_test):/reports/. reports
	@ docker-compose $(TEST_ARGS) up javascript_test
	@ docker cp $$(docker-compose $(TEST_ARGS) ps -q javascript_test):/reports/. reports
	@ $(call check_exit_code,$(TEST_ARGS),rspec_test)
	@ $(call check_exit_code,$(TEST_ARGS),javascript_test)
	${INFO} "Testing complete"

build:
	${INFO} "Building images..."
	@ docker-compose $(TEST_ARGS) build builder
	${INFO} "Building application artifacts..."
	@ docker-compose $(TEST_ARGS) up builder
	@ $(call check_exit_code,$(TEST_ARGS),builder)
	${INFO} "Copying application artifacts..."
	@ docker cp $$(docker-compose $(TEST_ARGS) ps -q builder):/build_artefacts/. release
	${INFO} "Build complete"

release:
	${INFO} "Pulling latest images..."
	@ docker-compose $(RELEASE_ARGS) pull &
	${INFO} "Building images..."
	@ docker-compose $(RELEASE_ARGS) build app &
	@ docker-compose $(RELEASE_ARGS) build --pull nginx &
	@ wait
	${INFO} "Release image build complete..."
	${INFO} "Starting application..."
	@ docker-compose $(RELEASE_ARGS) up -d nginx
	@ $(call check_service_health,$(RELEASE_ARGS),nginx)
	${INFO} "Application is running at http://$(DOCKER_HOST_IP):$(call get_port_mapping,$(RELEASE_ARGS),nginx,$(HTTP_PORT))"

clean:
	${INFO} "Deleting application release artifacts..."
	@ rm -rf release
	${INFO} "Destroying development environment..."
	@ docker-compose $(TEST_ARGS) down --volumes || true
	${INFO} "Destroying release environment..."
	@ docker-compose $(RELEASE_ARGS) down --volumes || true
	${INFO} "Removing dangling images..."
	@ docker images -q -f label=application=$(PROJECT_NAME) -f dangling=true | xargs -I ARGS docker rmi -f ARGS
	${INFO} "Clean complete"

tag:
	${INFO} "Tagging release image with tags $(TAG_ARGS)..."
	@ $(foreach tag,$(TAG_ARGS),$(call tag_image,$(RELEASE_ARGS),app,$(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME):$(tag));)
	${INFO} "Tagging complete"

tag%default:
	@ make tag latest $(APP_VERSION) $(GIT_TAG)

login:
	${INFO} "Logging in to Docker registry $$DOCKER_REGISTRY..."
	@ $(DOCKER_LOGIN_EXPRESSION)
	${INFO} "Logged in to Docker registry $$DOCKER_REGISTRY"

logout:
	${INFO} "Logging out of Docker registry $$DOCKER_REGISTRY..."
	@ docker logout
	${INFO} "Logged out of Docker registry $$DOCKER_REGISTRY"

publish:
	${INFO} "Publishing release image $(call get_image_id,$(RELEASE_ARGS),app) to $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME)..."
	@ $(call publish_image,$(RELEASE_ARGS),app,$(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME))
	${INFO} "Publish complete"

# Make will not attempt to evaluate arguments passed tasks as targets
%:
	@:
