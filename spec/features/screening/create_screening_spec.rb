# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Create Screening' do
  context 'when release two is enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'via start screening link' do
      allow(LUID).to receive(:generate).and_return(['DQJIYK'])
      new_screening = FactoryGirl.create(
        :screening,
        indexable: false,
        reference: 'DQJIYK',
        safety_alerts: [],
        safety_information: nil,
        address: { city: nil },
        assignee: nil
      )
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .with(body: as_json_without_root_id(new_screening))
        .and_return(json_body(new_screening.to_json, status: 201))

      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(new_screening.id)))
        .and_return(json_body(new_screening.to_json, status: 200))

      visit root_path
      click_link 'Start Screening'

      expect(
        a_request(
          :post, intake_api_url(ExternalRoutes.intake_api_screenings_path)
        ).with(body: as_json_without_root_id(new_screening))
      ).to have_been_made

      within '#snapshot-card' do
        expect(page).to have_content(
          'The Child Welfare History Snapshot allows you to search CWS/CMS for people and their'
        )
      end
      expect(page).to_not have_content('Edit Screening #DQJIYK')
    end
  end

  context 'when authentication is enabled' do
    let(:auth_validation_url) { 'http://www.example.com/authn/validate?token=123' }

    around do |example|
      with_config(
        authentication_base_url: 'http://www.example.com',
        base_path: ''
      ) do
        Feature.run_with_activated(:authentication) do
          example.run
        end
      end
    end

    context 'user has full name and staff Id' do
      let(:user_details) do
        {
          first_name: 'Joe',
          middle_initial: 'B',
          last_name: 'Cool',
          county: 'Mendocino',
          staff_id: '1234'
        }
      end
      let(:auth_details) { { staffId: '1234' } }

      scenario 'via start screening link' do
        user_name_display = 'Joe B. Cool - Mendocino'
        allow(LUID).to receive(:generate).and_return(['DQJIYK'])
        new_screening = FactoryGirl.create(
          :screening,
          reference: 'DQJIYK',
          safety_alerts: [],
          safety_information: nil,
          address: { city: nil },
          assignee: user_name_display,
          assignee_staff_id: '1234'
        )

        stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .with(body: as_json_without_root_id(new_screening))
          .and_return(json_body(new_screening.to_json, status: 201))

        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .and_return(json_body([].to_json, status: 200))

        stub_request(
          :get, intake_api_url(ExternalRoutes.intake_api_screening_path(new_screening.id))
        ).and_return(json_body(new_screening.to_json, status: 200))

        stub_request(:get, auth_validation_url)
          .and_return(json_body(auth_details.to_json, status: 200))

        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_staff_path('1234')))
          .and_return(json_body(user_details.to_json, status: 200))

        visit root_path(token: 123)
        click_link 'Start Screening'

        expect(page).to have_content('Edit Screening #DQJIYK')
        expect(page).to have_field(
          'Assigned Social Worker',
          with: user_name_display,
          disabled: true
        )
      end
    end

    context 'user has first and last name' do
      let(:user_details) do
        {
          first_name: 'Joe',
          last_name: 'Cool',
          county: 'Mendocino',
          staff_id: '1234'
        }
      end
      let(:auth_details) { { staffId: '1234' } }

      scenario 'via start screening link' do
        user_name_display = 'Joe Cool - Mendocino'
        allow(LUID).to receive(:generate).and_return(['DQJIYK'])
        new_screening = FactoryGirl.create(
          :screening,
          reference: 'DQJIYK',
          safety_alerts: [],
          safety_information: nil,
          address: { city: nil },
          assignee: user_name_display,
          assignee_staff_id: '1234'
        )
        stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .with(body: as_json_without_root_id(new_screening))
          .and_return(json_body(new_screening.to_json, status: 201))

        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .and_return(json_body([].to_json, status: 200))

        stub_request(
          :get, intake_api_url(ExternalRoutes.intake_api_screening_path(new_screening.id))
        ).and_return(json_body(new_screening.to_json, status: 200))
        stub_request(:get, auth_validation_url)
          .and_return(json_body(auth_details.to_json, status: 200))
        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_staff_path('1234')))
          .and_return(json_body(user_details.to_json, status: 200))

        visit root_path(token: 123)
        click_link 'Start Screening'

        expect(page).to have_content('Edit Screening #DQJIYK')
        expect(page).to have_field(
          'Assigned Social Worker',
          with: user_name_display,
          disabled: true
        )
      end
    end

    context 'no user information' do
      scenario 'via start screening link' do
        allow(LUID).to receive(:generate).and_return(['DQJIYK'])
        new_screening = FactoryGirl.create(
          :screening,
          reference: 'DQJIYK',
          safety_alerts: [],
          safety_information: nil,
          address: { city: nil },
          assignee: nil,
          assignee_staff_id: nil
        )
        stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .with(body: as_json_without_root_id(new_screening))
          .and_return(json_body(new_screening.to_json, status: 201))

        stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
          .and_return(json_body([].to_json, status: 200))

        stub_request(
          :get, intake_api_url(ExternalRoutes.intake_api_screening_path(new_screening.id))
        ).and_return(json_body(new_screening.to_json, status: 200))

        stub_request(:get, auth_validation_url)
          .and_return(status: 200)

        visit root_path(token: 123)
        click_link 'Start Screening'

        expect(page).to have_content('Edit Screening #DQJIYK')
        expect(page).to have_field('Assigned Social Worker', with: '', disabled: false)
      end
    end
  end

  scenario 'via start screening link' do
    allow(LUID).to receive(:generate).and_return(['DQJIYK'])
    new_screening = FactoryGirl.create(
      :screening,
      reference: 'DQJIYK',
      safety_alerts: [],
      safety_information: nil,
      address: { city: nil },
      assignee: nil
    )
    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .with(body: as_json_without_root_id(new_screening))
      .and_return(json_body(new_screening.to_json, status: 201))

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body([].to_json, status: 200))

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(new_screening.id)))
      .and_return(json_body(new_screening.to_json, status: 200))

    visit root_path
    click_link 'Start Screening'

    expect(
      a_request(
        :post, intake_api_url(ExternalRoutes.intake_api_screenings_path)
      ).with(body: as_json_without_root_id(new_screening))
    ).to have_been_made

    expect(page).to have_content('Edit Screening #DQJIYK')
  end
end
