#!/bin/bash

: ${SECRET_KEY_BASE=$(openssl rand -base64 32)}
env | grep -q ^SECRET_KEY_BASE= && export SECRET_KEY_BASE
bundle exec puma -e production -C config/puma.rb
