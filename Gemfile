# frozen_string_literal: true

source 'https://rubygems.org'

gem 'faraday'
gem 'faraday_middleware'
gem 'feature'
gem 'haml', '~> 5.0.1'
gem 'haml-rails'
gem 'high_voltage'
gem 'newrelic_rpm'
gem 'nokogiri', '~> 1.8.1'
gem 'puma'
gem 'rails', '~> 5.1'
gem 'redis-rails', '~> 5.0.2'
gem 'responders'
gem 'virtus'
gem 'webpacker'
gem 'yard', '~> 0.9.11'

group :development, :test do
  gem 'factory_bot_rails', require: false
  gem 'ffaker'
  gem 'fpm',
    git: 'https://github.com/jordansissel/fpm.git',
    ref: '488863b3211572ba5488b6f3956aa365d847a48b'
  gem 'haml_lint', '0.27.0'
  gem 'i18n-tasks'
  gem 'parallel_tests', '2.21.2'
  gem 'pry'
  gem 'pry-byebug'
  gem 'pry-doc'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-theme'
  gem 'rspec-rails', '~> 3.4'
  gem 'rubocop', '0.50.0'
  gem 'rubocop-junit-formatter'
  gem 'scss_lint'
end

group :development do
  gem 'license_finder'
  gem 'spring'
  gem 'web-console', '~> 3.5'
end

group :test do
  gem 'capybara', '2.15.1'
  gem 'capybara-accessible'
  gem 'capybara-screenshot'
  gem 'faker'
  gem 'headless', '2.3.1', require: false
  gem 'poltergeist'
  gem 'rails-controller-testing'
  gem 'rspec_junit_formatter', require: false
  gem 'selenium-webdriver', '3.4.0'
  gem 'simplecov-parallel', require: false
  gem 'webmock'
end
