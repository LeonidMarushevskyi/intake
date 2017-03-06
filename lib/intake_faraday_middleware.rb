# frozen_string_literal: true
require 'faraday'
require 'api_error'

module IntakeFaradayMiddleware
  # RaiseHttpException handles the response codes at request level
  class RaiseHttpException < Faraday::Middleware
    def call(env)
      @app.call(env).on_complete do |response|
        handle_response(env, response)
      end
    end

    def handle_response(env, response) # rubocop:disable Metrics/MethodLength
      method = env[:method]
      status = response[:status]

      is_good = case status
                when 200
                  method == :get || method == :put
                when 201
                  method == :post
                when 204
                  method == :delete
                else
                  false
                end

      raise_error(env, response) unless is_good
    end

    def initialize(app)
      super app
      @parser = nil
    end

    def raise_error(env, response)
      raise ApiError,
        message: "Error while calling #{env[:url].path}",
        response: response,
        sent_attributes: env[:body],
        url: env[:url].path,
        method: env[:method]
    end
  end
end
