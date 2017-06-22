# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Screening Information Validations' do
  let(:screening) { FactoryGirl.create(:screening) }

  context 'On the edit page' do
    before do
      stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))

      visit edit_screening_path(id: screening.id)

      # TODO: remove this once we can consistently have a fresh page for these specs
      page.evaluate_script('window.location.reload()')
    end

    scenario 'user sees that the social worker field is required' do
      within '#screening-information-card.edit' do
        expect(page).not_to have_content('Please enter an assigned worker.')
        page.find('#assignee').native.click
        expect(page).not_to have_content('Please enter an assigned worker.')
        page.find('#name').native.click
        expect(page).to have_content('Please enter an assigned worker.')
        fill_in 'Assigned Social Worker', with: 'My Name'
        page.find('#name').native.click
        expect(page).not_to have_content('Please enter an assigned worker.')
      end
    end

    scenario 'user saves information card without social worker and then adds one' do
      stub_request(:put, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .with(json_body(as_json_without_root_id(screening)))
        .and_return(json_body(screening.to_json))

      within '#screening-information-card.edit' do
        expect(page).not_to have_content('Please enter an assigned worker.')
        click_button 'Save'
      end

      within '#screening-information-card.show' do
        expect(page).to have_content('Please enter an assigned worker.')
        click_link 'Edit'
      end

      screening.assign_attributes(assignee: 'My Name')
      stub_request(:put, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .with(json_body(as_json_without_root_id(screening)))
        .and_return(json_body(screening.to_json))

      within '#screening-information-card.edit' do
        expect(page).to have_content('Please enter an assigned worker.')
        fill_in 'Assigned Social Worker', with: 'My Name'
        page.find('#name').click
        click_button 'Save'
      end

      within '#screening-information-card.show' do
        expect(page).to_not have_content('Please enter an assigned worker.')
      end
    end
  end

  context 'On the show page' do
    before do
      stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))

      visit screening_path(id: screening.id)
    end

    scenario 'user sees that social worker field is required on page load' do
      within '#screening-information-card.show' do
        expect(page).to have_content('Please enter an assigned worker.')
      end
    end
  end
end
