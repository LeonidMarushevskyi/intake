# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Screenings Index' do
  scenario 'list all screenings' do
    screening_one = FactoryGirl.create(
      :screening,
      reference: 'ABCDEF',
      created_at: '2016-08-11T18:24:22.157Z',
      name: 'Little Shop Of Horrors',
      response_time: 'immediate',
      screening_decision: 'evaluate_out'
    )
    screening_two = FactoryGirl.create(
      :screening,
      reference: 'HIJKLM',
      created_at: '2016-07-07T11:21:22.007Z',
      name: 'The Shining',
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation'
    )
    screening_three = FactoryGirl.create(
      :screening,
      reference: 'NOPQRS',
      created_at: '2016-08-10T09:11:22.112Z',
      name: 'It Follows',
      response_time: 'more_than_twenty_four_hours',
      screening_decision: 'referral_to_other_agency'
    )
    screenings = [screening_one, screening_two, screening_three]

    query = { query: { filtered: { filter: { bool: { must: [] } } } } }
    stub_request(:get, api_screenings_search_path)
      .with(body: query.to_json)
      .and_return(body: screenings.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit screenings_path

    within 'thead' do
      expect(page).to have_css('th', text: 'Name & ID')
      expect(page).to have_css('th', text: 'Response Time')
      expect(page).to have_css('th', text: 'Decision')
      expect(page).to have_css('th', text: 'Report Date')
    end

    within 'tbody' do
      expect(page).to have_css('tr', count: 3)
      rows = all('tr')

      within rows[0] do
        expect(page).to have_link('Little Shop Of Horrors - ABCDEF')
        expect(page).to have_content('Immediate')
        expect(page).to have_content('Evaluate Out')
        expect(page).to have_content('08/11/2016')
      end

      within rows[1] do
        expect(page).to have_link('The Shining - HIJKLM')
        expect(page).to have_content('Within 24 hours')
        expect(page).to have_content('Accept for Investigation')
        expect(page).to have_content('07/07/2016')
      end

      within rows[2] do
        expect(page).to have_link('It Follows - NOPQRS')
        expect(page).to have_content('More than 24 hours')
        expect(page).to have_content('Referral to Other Agency')
        expect(page).to have_content('08/10/2016')
      end
    end
  end

  scenario 'filter screenings by response time' do
    screening_one = FactoryGirl.create(
      :screening,
      reference: 'ABCDEF',
      created_at: '2016-08-11T18:24:22.157Z',
      name: 'Little Shop Of Horrors',
      response_time: 'immediate',
      screening_decision: 'evaluate_out'
    )
    screening_two = FactoryGirl.create(
      :screening,
      reference: 'HIJKLM',
      created_at: '2016-07-07T11:21:22.007Z',
      name: 'The Shining',
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation'
    )
    screening_three = FactoryGirl.create(
      :screening,
      reference: 'NOPQRS',
      created_at: '2016-08-10T09:11:22.112Z',
      name: 'It Follows',
      response_time: 'more_than_twenty_four_hours',
      screening_decision: 'referral_to_other_agency'
    )
    screenings = [screening_one, screening_two, screening_three]

    query = { query: { filtered: { filter: { bool: { must: [] } } } } }
    stub_request(:get, api_screenings_search_path)
      .with(body: query)
      .and_return(body: screenings.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    immediate_screenings = [screening_one]
    immediate_query = {
      query: {
        filtered: {
          filter: {
            bool: {
              must: [
                { terms: { response_time: ['immediate'] } }
              ]
            }
          }
        }
      }
    }
    stub_request(:get, api_screenings_search_path)
      .with(body: immediate_query)
      .and_return(body: immediate_screenings.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    immediate_and_24hrs_screenings = [screening_one, screening_two]
    immediate_and_24hrs_query = {
      query: {
        filtered: {
          filter: {
            bool: {
              must: [
                { terms: { response_time: %w(immediate within_twenty_four_hours) } }
              ]
            }
          }
        }
      }
    }
    stub_request(:get, api_screenings_search_path)
      .with(body: immediate_and_24hrs_query)
      .and_return(body: immediate_and_24hrs_screenings.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit screenings_path

    find('label', text: 'Immediate').click
    find('label', text: 'Within 24 hours').click

    within 'tbody' do
      expect(page).to have_css('tr', count: 2)
      rows = all('tr')

      within rows[0] do
        expect(page).to have_link('Little Shop Of Horrors - ABCDEF')
        expect(page).to have_content('Immediate')
        expect(page).to have_content('Evaluate Out')
        expect(page).to have_content('08/11/2016')
      end

      within rows[1] do
        expect(page).to have_link('The Shining - HIJKLM')
        expect(page).to have_content('Within 24 hours')
        expect(page).to have_content('Accept for Investigation')
        expect(page).to have_content('07/07/2016')
      end
    end
  end
end
