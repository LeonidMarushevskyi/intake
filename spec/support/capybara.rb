# frozen_string_literal: true
require 'capybara/rspec'

Capybara.default_driver = :accessible
Capybara.javascript_driver = Capybara.default_driver
