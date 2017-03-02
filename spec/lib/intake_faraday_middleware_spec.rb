# frozen_string_literal: true
require 'intake_faraday_middleware'

describe IntakeFaradayMiddleware::RaiseHttpException do
  describe '#call' do
    let(:app) { double :app }
    let(:middleware) { IntakeFaradayMiddleware::RaiseHttpException.new(app) }
    let(:request_on_flight) { double :request_on_flight }

    it 'create without error' do
      env = {
        url: URI('/api/v1/participants'),
        body: 'this is the body',
        method: :post
      }

      response_env = env.merge(status: 201, body: '!kaboom')
      response = Faraday::Response.new(response_env)

      expect(app).to receive(:call)
        .with(env)
        .and_return(response)

      expect do
        middleware.call(env)
      end.to_not raise_error
    end

    it 'get without error' do
      env = {
        url: URI('/api/v1/participants'),
        body: 'this is the body',
        method: :get
      }

      response_env = env.merge(status: 200, body: '!kaboom')
      response = Faraday::Response.new(response_env)

      expect(app).to receive(:call)
        .with(env)
        .and_return(response)

      expect do
        middleware.call(env)
      end.to_not raise_error
    end

    it 'deletes without error' do
      env = {
        url: '/api/v1/participants',
        body: 'this is the body',
        method: :delete
      }

      response_env = env.merge(status: 204, body: '!kaboom')
      response = Faraday::Response.new(response_env)

      expect(app).to receive(:call)
        .with(env)
        .and_return(response)

      expect do
        middleware.call(env)
      end.to_not raise_error
    end

    it 'deletes with error' do
      env = {
        url: URI('/api/v1/participants'),
        body: 'this is the body',
        method: :delete
      }

      response_env = env.merge(status: 500, body: 'kaboom')
      response = Faraday::Response.new(response_env)

      expect(app).to receive(:call)
        .with(env)
        .and_return(response)

      expect do
        middleware.call(env)
      end.to raise_error(ApiError, 'Error while calling /api/v1/participants')
    end
  end
end
