#!/bin/bash

cd "$APP_HOME"

bundle install -j24

npm install --spin=false

exec "$@"
