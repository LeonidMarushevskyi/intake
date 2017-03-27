# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Screenings Index' do
  scenario 'list all screenings' do
    screening_one = FactoryGirl.create(
      :screening,
      reference: 'ABCDEF',
      started_at: '2016-08-11T18:24:22.157Z',
      name: 'Little Shop Of Horrors',
      screening_decision: 'screen_out'
    )
    screening_two = FactoryGirl.create(
      :screening,
      reference: 'HIJKLM',
      started_at: '2016-07-07T11:21:22.007Z',
      name: 'The Shining',
      screening_decision: 'promote_to_referral'
    )
    screening_three = FactoryGirl.create(
      :screening,
      reference: 'NOPQRS',
      started_at: '2016-08-10T09:11:22.112Z',
      name: 'It Follows',
      screening_decision: 'differential_response'
    )
    screenings = [screening_one, screening_two, screening_three]

    stub_request(:get, api_screenings_path)
      .and_return(body: screenings.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit screenings_path

    within 'thead' do
      expect(page).to have_css('th', text: 'Name & ID')
      expect(page).to have_css('th', text: 'Decision')
      expect(page).to have_css('th', text: 'Report Date')
    end

    within 'tbody' do
      expect(page).to have_css('tr', count: 3)
      rows = all('tr')

      within rows[0] do
        expect(page).to have_link('Little Shop Of Horrors - ABCDEF')
        expect(page).to have_content('Screen out')
        expect(page).to have_content('08/11/2016')
      end

      within rows[1] do
        expect(page).to have_link('The Shining - HIJKLM')
        expect(page).to have_content('Promote to referral')
        expect(page).to have_content('07/07/2016')
      end

      within rows[2] do
        expect(page).to have_link('It Follows - NOPQRS')
        expect(page).to have_content('Differential response')
        expect(page).to have_content('08/10/2016')
      end
    end
  end
end
