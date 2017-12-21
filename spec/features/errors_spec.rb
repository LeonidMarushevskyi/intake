# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'error pages' do
  let(:base_path) { 'intake' }
  around do |example|
    Rails.application.config.consider_all_requests_local = false
    Rails.application.config.action_dispatch.show_exceptions = true
    example.run
    Rails.application.config.consider_all_requests_local = true
    Rails.application.config.action_dispatch.show_exceptions = false
  end

  context 'page does not exist' do
    scenario 'renders 404 page' do
      if ENV.key?('TEST_ENV_NUMBER')
        skip 'Pending as this test fails during parallel runs'
      end
      stub_request(:get, '/this_page_does_not_exist').and_return(json_body('NotFound', status: 404))
      visit '/this_page_does_not_exist'
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard', href: '/')
    end
  end

  context 'screening does not exist' do
    scenario 'renders not found error page' do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(1)))
        .and_return(json_body('Screening is not found!!', status: 404))
      visit edit_screening_path(id: 1)
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard', href: '/')
    end
  end

  context 'investigation does not exist' do
    scenario 'renders not found error page' do
      stub_request(:get, ferb_api_url(ExternalRoutes.ferb_api_investigation_path(1)))
        .and_return(json_body('Investigation is not found!!', status: 404))
      visit investigation_path(id: 1)
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard', href: '/')
    end
  end

  context 'contact does not exist' do
    scenario 'renders not found error page' do
      stub_request(:get, ferb_api_url(ExternalRoutes.ferb_api_investigations_contact_path(1, 1)))
        .and_return(json_body('investigation contact is not found!!', status: 404))
      visit investigation_contact_path(investigation_id: 1, id: 1)
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard', href: '/')
    end
  end

  context 'when user attempts to access a screening created by another' do
    scenario 'renders 403 page' do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(1)))
        .and_return(json_body('Forbidden!!', status: 403))
      visit edit_screening_path(id: 1)
      expect(page).to have_current_path('/forbidden')
      expect(page).to have_text('This page is restricted.')
      expect(page).to have_text("You don't have the appropriate permissions to view this page.")
      expect(page).to have_link('Return to your dashboard', href: '/')
    end
  end

  context 'server has error' do
    scenario 'renders 500 page' do
      pending 'implemented but fails because react recovers'
      stub_request(:get, '/screenings/2').and_return(json_body('I failed', status: 500))
      visit '/screenings/2'

      expect(page).to have_text('Sorry, something went wrong.')
      expect(page).to have_text(
        "It's nothing you did. Due to an entirely internal error, "\
        'your request could not be completred. Please try refreshing the page.'
      )
    end
  end
end

feature 'error banner' do
  let(:screening) { FactoryGirl.create(:screening, :submittable) }
  context 'error occurred after page was loaded' do
    context 'with referral_submit' do
      let(:referral_id) { FFaker::Guid.guid }

      scenario 'hide the error banner after submit action succeeds on second try' do
        Feature.run_with_activated(:referral_submit) do
          stub_request(
            :get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id))
          ).and_return(json_body(screening.to_json, status: 200))
          stub_empty_relationships_for_screening(screening)
          stub_empty_history_for_screening(screening)
          visit edit_screening_path(id: screening.id)
          stub_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(screening.id))
          ).and_return(json_body([].to_json, status: 500))
          visit edit_screening_path(id: screening.id)
          expect(page).to_not have_text(
            'Something went wrong, sorry! Please try your last action again.'
          )
          cancel_all_cards
          click_button 'Submit'
          expect(page).to have_text(
            'Something went wrong, sorry! Please try your last action again.'
          )
          screening.referral_id = referral_id
          stub_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(screening.id))
          ).and_return(json_body(screening.to_json, status: 201))
          click_button 'Submit'

          expect(page).to_not have_text(
            'Something went wrong, sorry! Please try your last action again.'
          )
        end
      end
    end

    scenario 'hide the error banner after save action succeeds on second try' do
      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id))
      ).and_return(json_body(screening.to_json, status: 200))
      stub_empty_relationships_for_screening(screening)
      stub_empty_history_for_screening(screening)
      visit edit_screening_path(id: screening.id)
      stub_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id))
      ).and_return(json_body('some error', status: 500))
      expect(page).to_not have_text(
        'Something went wrong, sorry! Please try your last action again.'
      )
      within '#screening-information-card.edit' do
        click_button 'Save'
      end
      expect(page).to have_text(
        'Something went wrong, sorry! Please try your last action again.'
      )
      stub_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id))
      ).and_return(json_body(screening.to_json, status: 200))

      # clicking the save button but for some reason xvfb shows the banner over the button no matter
      # what when using the standard methods of clicking
      execute_script('$("#narrative-card .btn-primary").click()')
      expect(page).to_not have_text(
        'Something went wrong, sorry! Please try your last action again.'
      )
    end
  end
end
