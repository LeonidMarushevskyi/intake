# frozen_string_literal: true

source 'https://rubygems.org'

gem 'faraday'
gem 'faraday_middleware'
gem 'feature'
gem 'haml-rails'
gem 'high_voltage'
gem 'newrelic_rpm'
gem 'puma'
gem 'rails', '~> 5.1'
gem 'redis-rails'
gem 'responders'
gem 'virtus'
gem 'webpacker'

group :development, :test do
  gem 'factory_girl_rails', require: false
  gem 'ffaker'
  gem 'fpm',
    git: 'https://github.com/jordansissel/fpm.git',
    ref: '488863b3211572ba5488b6f3956aa365d847a48b'
  gem 'haml-lint'
  gem 'i18n-tasks'
  gem 'parallel_tests'
  gem 'pry'
  gem 'pry-byebug'
  gem 'pry-doc'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-theme'
  gem 'rspec-rails', '~> 3.4'
  gem 'rubocop'
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
  gem 'simplecov', require: false
  gem 'webmock'
end
