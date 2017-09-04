# frozen_string_literal: true

require 'rails_helper'

describe JsonAPI do
  let(:api_class) do
    Class.new(JsonAPI) do
      def self.connection
        Faraday.new(url: 'http://api_url')
      end
    end
  end

  describe '.make_api_call' do
    let(:security_token) { FFaker::Guid.guid }

    it 'sends get requests to the JSON API' do
      stub_request(:get, 'http://api_url/api/v1/screening/1')
      api_class.make_api_call(security_token, '/api/v1/screening/1', :get)
      expect(
        a_request(:get, 'http://api_url/api/v1/screening/1')
        .with(headers: { Authorization: security_token })
      ).to have_been_made
    end

    it 'sends post requests to the JSON API' do
      stub_request(:post, 'http://api_url/api/v1/screening').and_return(status: 201)
      api_class.make_api_call(
        security_token,
        '/api/v1/screening',
        :post,
        name: 'my new screening'
      )
      expect(
        a_request(:post, 'http://api_url/api/v1/screening')
        .with(
          body: { name: 'my new screening' },
          headers: { 'Content-Type' => 'application/json', Authorization: security_token }
        )
      ).to have_been_made
    end

    it 'sends put requests to the JSON API' do
      stub_request(:put, 'http://api_url/api/v1/screening/1').and_return(status: 200)
      api_class.make_api_call(
        security_token,
        '/api/v1/screening/1',
        :put,
        name: 'my new screening'
      )
      expect(
        a_request(:put, 'http://api_url/api/v1/screening/1')
        .with(
          body: { name: 'my new screening' },
          headers: { 'Content-Type' => 'application/json', Authorization: security_token }
        )
      ).to have_been_made
    end

    it 'sends delete requests to the JSON API' do
      stub_request(:delete, 'http://api_url/api/v1/screening/1').and_return(status: 204)
      api_class.make_api_call(security_token, '/api/v1/screening/1', :delete)
      expect(
        a_request(:delete, 'http://api_url/api/v1/screening/1')
        .with(headers: { Authorization: security_token })
      ).to have_been_made
    end
  end
end
