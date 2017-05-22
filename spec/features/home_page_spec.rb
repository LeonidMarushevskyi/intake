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
        :person_search,
        first_name: 'Marge',
        gender: 'female',
        last_name: 'Simpson',
        ssn: '123-23-1234',
        addresses: [address]
      )

      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(json_body([marge].to_json, status: 200))
      end

      visit root_path

      expect(page).to_not have_link 'Start Screening'

      fill_in_autocompleter 'People', with: 'Marge'

      expect(a_request(:get, intake_api_people_search_url(search_term: 'M'))).to_not have_been_made
      %w[Ma Mar Marg Marge].each do |search_text|
        expect(
          a_request(:get, intake_api_people_search_url(search_term: search_text))
        ).to have_been_made
      end
    end
  end

  scenario 'includes title and navigation links when release one is disabled' do
    Feature.run_with_deactivated(:release_one) do
      visit root_path

      expect(page).to have_title 'Intake'
      expect(page).to have_link 'Start Screening'
    end
  end

  scenario 'includes a list of saved screenings' do
    screening1 = FactoryGirl.create(
      :screening,
      name: 'Little Shop of Horrors',
      reference: 'H9S83',
      started_at: '2016-08-11T18:24:22.157Z',
      screening_decision: 'screen_out'
    )
    screening2 = FactoryGirl.create(
      :screening,
      name: 'The Shining',
      reference: 'DF90W5',
      started_at: '2016-08-12T18:24:22.157Z',
      screening_decision: 'promote_to_referral'
    )
    screening3 = FactoryGirl.create(
      :screening,
      name: 'It Follows',
      reference: 'Q7W0B6',
      started_at: '2016-08-17T18:24:22.157Z',
      screening_decision: 'differential_response'
    )
    stub_request(:get, intake_api_screenings_url)
      .and_return(json_body([screening1, screening2, screening3].to_json, status: 200))

    visit root_path
    within 'thead' do
      expect(page).to have_css('th', text: 'Name & ID')
      expect(page).to have_css('th', text: 'Decision')
      expect(page).to have_css('th', text: 'Report Date')
    end

    within 'tbody' do
      expect(page).to have_css('tr', count: 3)
      rows = all('tr')
      within rows[0] do
        expect(page).to have_content('H9S83')
        expect(page).to have_content('08/11/2016')
        expect(page).to have_content('Screen out')
      end
      within rows[1] do
        expect(page).to have_content('DF90W5')
        expect(page).to have_content('08/12/2016')
        expect(page).to have_content('Promote to referral')
      end
      within rows[2] do
        expect(page).to have_content('Q7W0B6')
        expect(page).to have_content('08/17/2016')
        expect(page).to have_content('Differential response')
      end
    end
  end
end
