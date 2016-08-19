#!/bin/bash

cd "$APP_HOME"

revision=$(git rev-parse HEAD)
output_dir="/ca_intake_build"
input_dir="/ca_intake"

bundle exec fpm -s dir -t deb --name ca_intake --version "$revision" --package "$output_dir" "$input_dir" 
