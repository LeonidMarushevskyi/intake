#!/bin/bash

export SECRET_KEY_BASE=$(openssl rand -base64 32)
bundle exec puma -e production -C config/puma.rb
