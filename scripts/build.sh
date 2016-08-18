#!/bin/bash

bundle exec fpm -s dir -t deb -n ca_intake -v $(git rev-parse head) -p /ruby_gems /ca_intake
