# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'
feature 'home page' do
  context 'when release one is enabled' do
    around do |example|
      Feature.run_with_activated(:release_one) do
        example.run
      end
    end

    scenario 'displays search bar' do
      address = FactoryGirl.create(
        :address,
        street_address: '123 Fake St',
        city: 'Springfield',
        state: 'NY',
        zip: '12345',
        type: 'Home'
      )
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        gender: 'female',
        last_name: 'Simpson',
        ssn: '123-23-1234',
        addresses: [address]
      )

      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(
          :get, host_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      visit root_path

      expect(page).to_not have_link 'Start Screening'

      fill_in_autocompleter 'People', with: 'Marge'

      expect(
        a_request(:get, host_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'M')))
      ).to_not have_been_made
      %w[Ma Mar Marg Marge].each do |search_text|
        expect(
          a_request(
            :get,
            host_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
          )
        ).to have_been_made
      end
    end
  end

  context 'when release two is enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'hide list of screenings when release two is enabled' do
      screening = FactoryGirl.create :screening, name: 'Test Screening', reference: 'ABCD'
      visit root_path
      expect(
        a_request(:get, host_url(ExternalRoutes.intake_api_screenings_path))
      ).to_not have_been_made
      expect(page).to have_link 'Start Screening'
      expect(page).not_to have_content screening.name
      expect(page).not_to have_content screening.reference
      expect(page).not_to have_css 'table'
    end
  end

  context 'when no releases are enabled' do
    scenario 'includes title and navigation links' do
      visit root_path
      expect(page).to have_title 'Intake'
      expect(page).to have_link 'Start Screening'
    end

    scenario 'includes a list of saved screenings' do
      screening_one = FactoryGirl.create(
        :screening_search,
        name: 'Little Shop of Horrors',
        assignee: 'Melody Pond',
        started_at: '2016-08-11T18:24:22.157Z',
        screening_decision: 'screen_out'
      )
      screening_two = FactoryGirl.create(
        :screening_search,
        name: 'The Shining',
        assignee: 'Sarah Jane Smith',
        started_at: '2016-08-12T18:24:22.157Z',
        screening_decision: 'promote_to_referral'
      )
      screening_without_name = FactoryGirl.create(
        :screening_search,
        assignee: 'Rory Williams',
        started_at: '2016-08-17T18:24:22.157Z',
        screening_decision: 'differential_response'
      )
      screenings = [screening_one, screening_two, screening_without_name]
      stub_request(:get, host_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screenings.to_json, status: 200))

      visit root_path
      within 'thead' do
        expect(page).to have_css('th', text: 'Screening Name')
        expect(page).to have_css('th', text: 'Type/Decision')
        expect(page).to have_css('th', text: 'Status')
        expect(page).to have_css('th', text: 'Assignee')
        expect(page).to have_css('th', text: 'Report Date and Time')
      end

      within 'tbody' do
        expect(page).to have_css('tr', count: 3)
        rows = all('tr')
        within rows[0] do
          expect(page).to have_link(
            screening_one.name, href: screening_path(id: screening_one.id)
          )
          expect(page).to have_content('Screen out')
          expect(page).to have_content('Melody Pond')
          expect(page).to have_content('08/11/2016')
        end
        within rows[1] do
          expect(page).to have_link(
            screening_two.name, href: screening_path(id: screening_two.id)
          )
          expect(page).to have_content('Promote to referral')
          expect(page).to have_content('Sarah Jane Smith')
          expect(page).to have_content('08/12/2016')
        end
        within rows[2] do
          expect(page).to have_link(
            screening_without_name.id, href: screening_path(id: screening_without_name.id)
          )
          expect(page).to have_content('Differential response')
          expect(page).to have_content('Rory Williams')
          expect(page).to have_content('08/17/2016')
        end
      end
    end
  end
end
