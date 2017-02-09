# frozen_string_literal: true
# Be sure to restart your server when you modify this file.

Feature.with(:centralized_sessions) do
  Rails.application.config.session_store :redis_store, servers: {
    host: ENV.fetch('REDIS_HOST'),
    port: ENV.fetch('REDIS_PORT'),
    db: 0,
    namespace: 'session'
  }, expires_in: 4.hours
end

Feature.without(:centralized_sessions) do
  Rails.application.config.session_store :cookie_store, key: '_rails_template_session'
end
