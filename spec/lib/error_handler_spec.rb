# frozen_string_literal: true

require 'spec_helper'
require 'error_handler'
require 'rails_helper'

describe ErrorHandler do
  describe 'Error Handling' do
    before do
      Foo = Class.new(ApplicationController)
      Foo.class_eval do
        include ErrorHandler
      end
    end

    it 'handles StandardError and returns a custom JSON message' do
      foo = Foo.new

      begin
        raise StandardError
      rescue StandardError => e
        resp = foo.generate_standard_error(e)
      end

      standard_error_response = {
        'error': 'standard_error',
        'status': 500,
        'message': 'StandardError'
      }.as_json

      expect(resp).to eq standard_error_response
    end

    it 'handles ApiError and returns a custom JSON message' do
      foo = Foo.new

      begin
        raise ApiError,
          http_code: 500,
          response_body: 'body',
          url: '/var/foo',
          method: :post,
          sent_attributes: { foo: 'bar' }
      rescue ApiError => e
        resp = foo.generate_api_error(e)
      end

      standard_error_response = { error: 'api_error',
                                  status: 'N/A',
                                  message: 'ApiError',
                                  api_response_body: 'N/A',
                                  url: '/var/foo',
                                  method: 'post',
                                  sent_attributes: { 'foo': 'bar' } }.as_json

      expect(resp).to eq standard_error_response
    end
  end
end
