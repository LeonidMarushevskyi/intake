# frozen_string_literal: true
require 'capybara/rspec'
require 'capybara/accessible'
require 'support/capybara/screenshot'

Capybara.default_driver = :accessible_selenium
Capybara.javascript_driver = Capybara.default_driver
