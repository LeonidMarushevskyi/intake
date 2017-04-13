# frozen_string_literal: true
require 'rails_helper'

describe API do
  before do
    allow(ENV).to receive(:fetch).with('TPT_API_URL', false)
      .and_return('http://tpt_api_url')
    allow(ENV).to receive(:fetch).with('TPT_API_URL')
      .and_return('http://tpt_api_url')
    allow(ENV).to receive(:fetch).with('API_URL')
      .and_return('http://api')
  end

  describe '.make_api_call' do
    let(:security_token) { 'my_security_token' }

    it 'sends get requests to the API' do
      stub_request(:get, %r{/api/v1/screening/1})
      API.make_api_call(security_token, '/api/v1/screening/1', :get)
      expect(
        a_request(:get, %r{/api/v1/screening/1})
          .with(headers: { Authorization: security_token })
      ).to have_been_made
    end

    it 'sends post requests to the API' do
      stub_request(:post, %r{/api/v1/screening}).and_return(status: 201)
      API.make_api_call(security_token, '/api/v1/screening', :post, name: 'my new screening')
      expect(
        a_request(:post, %r{/api/v1/screening})
          .with(
            body: { name: 'my new screening' },
            headers: { 'Content-Type' => 'application/json', Authorization: security_token }
          )
      ).to have_been_made
    end

    it 'sends put requests to the API' do
      stub_request(:put, %r{/api/v1/screening/1}).and_return(status: 200)
      API.make_api_call(security_token, '/api/v1/screening/1', :put, name: 'my new screening')
      expect(
        a_request(:put, %r{/api/v1/screening/1})
          .with(
            body: { name: 'my new screening' },
            headers: { 'Content-Type' => 'application/json', Authorization: security_token }
          )
      ).to have_been_made
    end

    it 'sends delete requests to the API' do
      stub_request(:delete, %r{/api/v1/screening/1}).and_return(status: 204)
      API.make_api_call(security_token, '/api/v1/screening/1', :delete)
      expect(
        a_request(:delete, %r{/api/v1/screening/1})
        .with(headers: { Authorization: security_token })
      ).to have_been_made
    end

    it 'makes a request to TPT API url for people search when TPT_API env var is set' do
      tpt_api_url = 'http://tpt_api_url/api/v1/people_search?search_term=Bob'
      stub_request(:get, tpt_api_url).and_return(status: 200)
      API.make_api_call(security_token, '/api/v1/people_search?search_term=Bob', :get)
      expect(
        a_request(:get, tpt_api_url)
        .with(headers: { Authorization: security_token })
      ).to have_been_made
    end

    it 'makes a request to default intake api if TPT_API env var is not present' do
      allow(ENV).to receive(:fetch).with('TPT_API_URL', false)
        .and_return(false)

      stub_request(:get, 'http://api/api/v1/people_search?search_term=Bob').and_return(status: 200)
      API.make_api_call(security_token, '/api/v1/people_search?search_term=Bob', :get)
      expect(
        a_request(:get, 'http://api/api/v1/people_search?search_term=Bob')
        .with(headers: { Authorization: security_token })
      ).to have_been_made
    end
  end
end
