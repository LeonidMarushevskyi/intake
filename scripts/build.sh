#!/bin/bash

cd "$APP_HOME"

revision=$(git rev-parse --short HEAD)
output_dir="/ca_intake_build"
input_dir="/ca_intake"

rm -rf public/assets && RAILS_ENV=production bin/gulp

bundle exec fpm --deb-no-default-config-files -s dir -t deb --name "intake_accelerator" \
--version "1.$revision" --package "$output_dir" "$input_dir"
