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
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      visit root_path

      expect(page).to_not have_link 'Start Screening'

      fill_in_autocompleter 'People', with: 'Marge', split: true

      expect(
        a_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'M'))
        )
      ).to_not have_been_made
      %w[Ma Mar Marg Marge].each do |search_text|
        expect(
          a_request(
            :get,
            intake_api_url(
              ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text)
            )
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
        a_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
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
        screening_decision: 'differential_response'
      )
      screening_two = FactoryGirl.create(
        :screening_search,
        name: 'The Shining',
        assignee: 'Sarah Jane Smith',
        started_at: '2016-08-12T12:12:22.157Z',
        screening_decision: 'information_to_child_welfare_services'
      )
      screening_without_name = FactoryGirl.create(
        :screening_search,
        assignee: 'Rory Williams',
        started_at: '2016-08-17T01:24:22.157Z',
        screening_decision: 'differential_response'
      )
      screening_without_decision = FactoryGirl.create(
        :screening_search,
        name: 'Elm Street',
        assignee: 'Freddy Krueger',
        started_at: '2017-10-13T00:24:22.157Z',
        screening_decision: nil
      )
      screenings =
        [screening_one, screening_two, screening_without_name, screening_without_decision]

      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
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
        expect(page).to have_css('tr', count: 4)
        rows = all('tr')
        within rows[0] do
          expect(page).to have_link(screening_one.name, href: screening_path(id: screening_one.id))
          expect(page).to have_text(
            'Little Shop of Horrors Differential response Melody Pond 08/11/2016 11:24 AM'
          )
        end
        within rows[1] do
          expect(page).to have_link(screening_two.name, href: screening_path(id: screening_two.id))
          expect(page).to have_text(
            'The Shining Information to child welfare services Sarah Jane Smith 08/12/2016 5:12 AM'
          )
        end
        within rows[2] do
          expect(page).to have_link(
            screening_without_name.id, href: screening_path(id: screening_without_name.id)
          )
          expect(page).to have_text(
            'Differential response Rory Williams 08/16/2016 6:24 PM'
          )
        end
        within rows[3] do
          expect(page).to have_link(
            screening_without_decision.name, href: screening_path(id: screening_without_decision.id)
          )
          expect(page).to have_text('Elm Street Freddy Krueger 10/12/2017 5:24 PM')
        end
      end
    end

    scenario 'screenings display response time if decision is promote to referral' do
      screenings = [
        FactoryGirl.create(
          :screening_search,
          name: "It's bigger on the inside",
          assignee: 'Clara Oswald',
          started_at: '2016-08-12T00:00:00.157Z',
          screening_decision: 'promote_to_referral',
          screening_decision_detail: nil
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'promote_to_referral',
          screening_decision_detail: 'immediate'
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'promote_to_referral',
          screening_decision_detail: '3_days'
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'promote_to_referral',
          screening_decision_detail: '5_days'
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'promote_to_referral',
          screening_decision_detail: '10_days'
        )
      ]
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screenings.to_json, status: 200))

      visit root_path
      within 'tbody' do
        rows = all('tr')
        within rows[0] do
          expect(page).to have_text("It's bigger on the inside Clara Oswald 08/11/2016 5:00 PM")
        end
        within rows[1] do
          expect(page).to have_content('Immediate')
        end
        within rows[2] do
          expect(page).to have_content('3 days')
        end
        within rows[3] do
          expect(page).to have_content('5 days')
        end
        within rows[4] do
          expect(page).to have_content('10 days')
        end
      end
    end

    scenario 'screenings display category if decision is screen out' do
      screenings = [
        FactoryGirl.create(
          :screening_search,
          name: "It's bigger on the inside",
          assignee: 'Clara Oswald',
          started_at: '2016-08-12T00:00:00.157Z',
          screening_decision: 'screen_out',
          screening_decision_detail: nil
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'screen_out',
          screening_decision_detail: 'evaluate_out'
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'screen_out',
          screening_decision_detail: 'information_request'
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'screen_out',
          screening_decision_detail: 'consultation'
        ),
        FactoryGirl.create(
          :screening_search,
          screening_decision: 'screen_out',
          screening_decision_detail: 'other'
        )
      ]
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screenings.to_json, status: 200))

      visit root_path
      within 'tbody' do
        rows = all('tr')
        within rows[0] do
          expect(page).to have_text("It's bigger on the inside Clara Oswald 08/11/2016 5:00 PM")
        end
        within rows[1] do
          expect(page).to have_content('Evaluate out')
        end
        within rows[2] do
          expect(page).to have_content('Information request')
        end
        within rows[3] do
          expect(page).to have_content('Consultation')
        end
        within rows[4] do
          expect(page).to have_content('Other')
        end
      end
    end

    scenario 'screenings display reported date time time from now' do
      screening = FactoryGirl.create(
        :screening_search,
        started_at: 1.year.ago.strftime('%FT%T.%LZ')
      )
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body([screening].to_json, status: 200))

      visit root_path
      within 'tbody' do
        expect(page).to have_content('(a year ago)')
      end
    end

    context 'with investigations feature enabled' do
      around do |example|
        Feature.run_with_activated(:investigations) do
          example.run
        end
      end

      scenario 'screenings display link to investigation when referral id is present' do
        screening_with_name = FactoryGirl.create(
          :screening_search,
          name: 'Screening with name and investigation',
          referral_id: '5667'
        )
        screening_without_name = FactoryGirl.create(
          :screening_search,
          referral_id: '1111'
        )
        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .and_return(json_body([screening_without_name, screening_with_name].to_json, status: 200))

        visit root_path
        within 'tbody' do
          expect(page).to have_link(
            'Screening with name and investigation', href: investigation_path(id: '5667')
          )
          expect(page).to have_link('1111', href: investigation_path(id: '1111'))
        end
      end
    end

    context 'with investigations feature disabled' do
      around do |example|
        Feature.run_with_deactivated(:investigations) do
          example.run
        end
      end

      scenario 'screenings display link to screenng even when referral id is present' do
        screening_with_name = FactoryGirl.create(
          :screening_search,
          id: 'ABC123',
          name: 'Screening with name and investigation',
          referral_id: '5667'
        )
        screening_without_name = FactoryGirl.create(
          :screening_search,
          id: 'DEF456',
          referral_id: '1111'
        )
        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .and_return(json_body([screening_without_name, screening_with_name].to_json, status: 200))

        visit root_path
        within 'tbody' do
          expect(page).to have_link(
            'Screening with name and investigation',
            href: screening_path(id: screening_with_name.id)
          )
          expect(page).to have_link('1111', href: screening_path(id: screening_without_name.id))
        end
      end
    end
  end
end
