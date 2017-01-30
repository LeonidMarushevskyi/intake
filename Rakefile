# frozen_string_literal: true
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they
# will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

if ENV['GENERATE_TEST_REPORTS'] == 'yes'
  require 'rspec_junit_formatter'
  spec_opts = "--format RspecJunitFormatter --out #{ENV['CI_REPORTS']}/rspec.xml"
  ENV['SPEC_OPTS'] = "#{ENV['SPEC_OPTS']} #{spec_opts}"
end
