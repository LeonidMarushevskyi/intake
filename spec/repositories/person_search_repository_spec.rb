# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:results) { [{ id: '1' }, { id: '2' }] }
    let(:response) { double(:response, body: results) }
    let(:search_term) { 'Robert Barathian' }

    context 'when people_search_tpt feature is OFF' do
      around do |example|
        Feature.run_with_deactivated(:people_search_tpt) do
          example.run
        end
      end

      context 'and tpt_api_url is set' do
        around do |example|
          original_config = Rails.application.config.intake
          Rails.application.config.intake[:tpt_api_url] = 'http://tpt_api_url'
          example.run
          Rails.application.config.intake = original_config
        end

        it 'returns the people results using TPT' do
          expect(TPT).to receive(:make_api_call)
            .with(
              security_token,
              "/api/v1/people_search?search_term=#{CGI.escape(search_term)}",
              :get
            ).and_return(response)
          person_results = PersonSearchRepository.search(security_token, search_term)
          expect(person_results.first.id).to eq('1')
          expect(person_results.last.id).to eq('2')
        end
      end

      context 'and tpt_api_url is not set' do
        around do |example|
          original_config = Rails.application.config.intake
          Rails.application.config.intake[:tpt_api_url] = nil
          example.run
          Rails.application.config.intake = original_config
        end

        it 'returns the people results using intake API' do
          expect(IntakeAPI).to receive(:make_api_call)
            .with(
              security_token,
              "/api/v1/people_search?search_term=#{CGI.escape(search_term)}",
              :get
            ).and_return(response)
          person_results = PersonSearchRepository.search(security_token, search_term)
          expect(person_results.first.id).to eq('1')
          expect(person_results.last.id).to eq('2')
        end
      end
    end

    context 'when people_search_tpt feature is ON' do
      around do |example|
        Feature.run_with_activated(:people_search_tpt) do
          example.run
        end
      end

      it 'returns the people results using TPT API' do
        expect(IntakeAPI).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v2/people_search?search_term=#{CGI.escape(search_term)}",
            :get
          ).and_return(response)
        person_results = PersonSearchRepository.search(security_token, search_term)
        expect(person_results.first.id).to eq('1')
        expect(person_results.last.id).to eq('2')
      end
    end
  end
end
