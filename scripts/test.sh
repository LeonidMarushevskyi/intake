#!/bin/bash

cd "$APP_HOME"

bundle install --without=development -j24

npm install --spin=false

exec "$@"
