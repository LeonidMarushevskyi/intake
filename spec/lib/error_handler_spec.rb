# frozen_string_literal: true

require 'spec_helper'
require 'error_handler'
require 'rails_helper'

describe ErrorHandler do
  describe 'Error Handling' do
    before(:all) do
      AppCtrl = Class.new(ApplicationController)
      AppCtrl.class_eval do
        include ErrorHandler
      end
      AppCtrlInstance = AppCtrl.new
    end

    context 'parse_issue_details' do
      it 'returns an empty array if nothing is passed in' do
        begin
          raise StandardError
        rescue StandardError => exception
          issue_details = AppCtrlInstance.parse_issue_details(exception)
        end

        expect(issue_details).to eq []
      end

      it 'returns an empty array when issue details does not exists' do
        begin
          raise ApiError,
            response: OpenStruct.new(
              status: 500,
              body: {}
            )
        rescue ApiError => exception
          issue_details = AppCtrlInstance.parse_issue_details(exception)
        end

        expect(issue_details).to eq []
      end

      it 'returns an array of issue details if it exists' do
        begin
          raise ApiError,
            response: OpenStruct.new(
              status: 500,
              body: {
                'issue_details': [
                  {
                    'incident_id': '1'
                  },
                  {
                    'incident_id': '2'
                  }
                ]
              }.as_json
            )
        rescue ApiError => exception
          issue_details = AppCtrlInstance.parse_issue_details(exception)
        end

        expect(issue_details).to eq [{ 'incident_id' => '1' }, { 'incident_id' => '2' }]
      end
    end

    it 'add issue details to response_body' do
      begin
        raise ApiError, {}
      rescue ApiError => e
        resp = AppCtrlInstance.add_issue_details(e)
      end

      expect(resp.api_error[:response_body]).to match a_hash_including(
        issue_details: [{
          incident_id: anything,
          status: anything,
          type: 'api_error',
          response_body: anything
        }]
      )
    end

    it 'returns a string of incident ids' do
      begin
        raise ApiError, {}
      rescue ApiError => exception
        exception = AppCtrlInstance.add_issue_details(exception)
        incident_ids = AppCtrlInstance.stringify_incident_ids(exception)
      end

      expect(incident_ids).not_to be_empty
    end

    it 'log_api_error' do
      begin
        raise ApiError, {}
      rescue ApiError => exception
        expect(Rails.logger).to receive(:error)
        AppCtrlInstance.log_api_error(exception)
      end
    end

    it 'log_standard_error' do
      begin
        raise ApiError, {}
      rescue ApiError => exception
        expect(Rails.logger).to receive(:error)
        AppCtrlInstance.log_standard_error(exception, '12345')
      end
    end

    it 'handles StandardError and returns a custom JSON message' do
      begin
        raise StandardError
      rescue StandardError => e
        resp = AppCtrlInstance.generate_standard_error(e, '12345')
      end

      standard_error_response = {
        error: :standard_error,
        status: 500,
        message: 'StandardError',
        api_response_body: {
          issue_details: [{
            incident_id: '12345',
            status: 500,
            type: :standard_error,
            response_body: 'StandardError'
          }]
        }
      }

      expect(resp).to eq standard_error_response
    end

    it 'handles ApiError and returns a custom JSON message' do
      begin
        raise ApiError,
          response: OpenStruct.new(
            status: 500,
            body: '{"issue_details": ["one", "two", "three"]}'
          ),
          url: '/var/AppCtrlInstance',
          method: :post,
          sent_attributes: { AppCtrlInstance: 'bar' }
      rescue ApiError => e
        resp = AppCtrlInstance.generate_api_error(e)
      end

      api_error_response = {
        error: 'api_error',
        status: 500,
        message: 'ApiError',
        api_response_body: {
          issue_details: %w[one two three]
        },
        url: '/var/AppCtrlInstance',
        method: 'post',
        sent_attributes: { 'AppCtrlInstance': 'bar' }
      }.as_json

      expect(resp).to eq api_error_response
    end
  end
end
