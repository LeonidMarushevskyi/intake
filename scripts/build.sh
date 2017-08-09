#!/bin/bash

cd "$APP_HOME"

revision=$(git rev-parse --short HEAD)
output_dir="/build_artefacts"
input_dir="/ca_intake"

rm -rf public/assets && RAILS_ENV=production bin/gulp && rm -rf public/packs && RAILS_ENV=production bin/webpack

bundle exec fpm --deb-no-default-config-files -s dir -t deb --name "intake_accelerator" \
--version "${APP_VERSION}" --package "$output_dir" "$input_dir"
