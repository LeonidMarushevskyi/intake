# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'action_cable/engine'
require 'rails/test_unit/railtie'
require_relative '../app/lib/external_routes'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CaIntake # :nodoc:
  # CA Intake configurations are set here.
  class Application < Rails::Application # :nodoc:
    config.autoload_paths << Rails.root.join('lib')
    config.exceptions_app = routes
    config.logger = Logger.new(STDOUT)
    config.log_level = :debug

    authentication_login_url = <<~URL.strip
      #{ENV.fetch('AUTHENTICATION_URL', '').chomp('/')}/authn/login?callback=
    URL

    authentication_logout_url = <<~URL.strip
      #{ENV.fetch('AUTHENTICATION_URL', '').chomp('/')}/authn/logout
    URL

    config.intake = {
      api_url: ENV.fetch('API_URL', nil),
      authentication_base_url: ENV.fetch('AUTHENTICATION_URL', ''),
      authentication_login_url: authentication_login_url,
      authentication_logout_url: authentication_logout_url,
      base_path: ENV.fetch('BASE_PATH', ''),
      client_only_search: ENV.fetch('CLIENT_ONLY_SEARCH', 'false') == 'true',
      ferb_api_url: ENV.fetch('FERB_API_URL', nil),
      dora_api_url: ENV.fetch('DORA_API_URL', nil),
      sdm_path: ExternalRoutes.sdm_path
    }
  end
end
