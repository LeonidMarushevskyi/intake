#!/bin/bash

cd "$APP_HOME"

bundle install -j24

yarn

exec "$@"
