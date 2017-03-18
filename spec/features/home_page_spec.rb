# frozen_string_literal: true
require 'rails_helper'
require 'feature/testing'
feature 'home page' do
  scenario 'displays search bar when release one is enabled' do
    Feature.run_with_activated(:release_one) do
      address = FactoryGirl.create(
        :address,
        street_address: '123 Fake St',
        city: 'Springfield',
        state: 'NY',
        zip: '12345',
        type: 'Home'
      )
      marge = FactoryGirl.create(
        :person,
        first_name: 'Marge',
        gender: 'female',
        last_name: 'Simpson',
        ssn: '123-23-1234',
        addresses: [address]
      )

      %w(Ma Mar Marg Marge).each do |search_text|
        stub_request(:get, api_people_search_path(search_term: search_text))
          .and_return(body: [marge].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
      end

      visit root_path

      expect(page).to_not have_link 'Start Screening'
      expect(page).to_not have_link 'Create Person'
      expect(page).to_not have_link 'Screenings'

      fill_in_autocompleter 'People', with: 'Marge'

      expect(a_request(:get, api_people_search_path(search_term: 'M'))).to_not have_been_made
      %w(Ma Mar Marg Marge).each do |search_text|
        expect(a_request(:get, api_people_search_path(search_term: search_text))).to have_been_made
      end
    end
  end

  scenario 'includes title and navigation links when release one is disabled' do
    Feature.run_with_deactivated(:release_one) do
      visit root_path

      expect(page).to have_title 'Intake'
      expect(page).to have_link 'Start Screening'
      expect(page).to have_link 'Create Person'
      expect(page).to have_link 'Screenings'
    end
  end
end
