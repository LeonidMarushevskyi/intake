# frozen_string_literal: true
require 'rails_helper'

describe API do
  before do
    @cached_env_tpt_api_url = ENV['TPT_API_URL']
    @cached_env_api_url = ENV['API_URL']
    ENV['TPT_API_URL'] = 'http://tpt_api_url'
    ENV['API_URL'] = 'http://api'
  end
  after do
    ENV['TPT_API_URL'] = @cached_env_tpt_api_url
    ENV['API_URL'] = @cached_env_api_url
  end

  describe '.make_api_call' do
    it 'sends get requests to the API' do
      stub_request(:get, %r{/api/v1/screening/1})
      API.make_api_call('/api/v1/screening/1', :get)
      expect(a_request(:get, %r{/api/v1/screening/1})).to have_been_made
    end

    it 'sends post requests to the API' do
      stub_request(:post, %r{/api/v1/screening}).and_return(status: 201)
      API.make_api_call('/api/v1/screening', :post, name: 'my new screening')
      expect(
        a_request(:post, %r{/api/v1/screening})
          .with(
            body: { name: 'my new screening' },
            headers: { 'Content-Type' => 'application/json' }
          )
      ).to have_been_made
    end

    it 'sends put requests to the API' do
      stub_request(:put, %r{/api/v1/screening/1}).and_return(status: 200)
      API.make_api_call('/api/v1/screening/1', :put, name: 'my new screening')
      expect(
        a_request(:put, %r{/api/v1/screening/1})
          .with(
            body: { name: 'my new screening' },
            headers: { 'Content-Type' => 'application/json' }
          )
      ).to have_been_made
    end

    it 'sends delete requests to the API' do
      stub_request(:delete, %r{/api/v1/screening/1}).and_return(status: 204)
      API.make_api_call('/api/v1/screening/1', :delete)
      expect(a_request(:delete, %r{/api/v1/screening/1})).to have_been_made
    end

    it 'makes a request to TPT API url for people search when TPT_API env var is set' do
      stub_request(:get, 'http://tpt_api_url/api/v1/people_search?search_term=Bob').and_return(status: 200)
      API.make_api_call('/api/v1/people_search?search_term=Bob', :get)
      expect(a_request(:get, 'http://tpt_api_url/api/v1/people_search?search_term=Bob')).to have_been_made
    end

    it 'makes a request to default intake api if TPT_API env var is not present' do
      cached_tpt_api = ENV['TPT_API_URL']
      ENV['TPT_API_URL'] = nil
      stub_request(:get, 'http://api/api/v1/people_search?search_term=Bob').and_return(status: 200)
      API.make_api_call('/api/v1/people_search?search_term=Bob', :get)
      expect(a_request(:get, 'http://api/api/v1/people_search?search_term=Bob')).to have_been_made
      ENV['TPT_API_URL'] = cached_tpt_api
    end

  end
end
