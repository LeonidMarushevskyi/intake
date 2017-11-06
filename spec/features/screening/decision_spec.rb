# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'decision card' do
  let(:screening) do
    FactoryGirl.create(
      :screening,
      screening_decision: 'promote_to_referral',
      screening_decision_detail: '3_days',
      additional_information: 'this is why it is'
    )
  end

  before(:each) do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)
  end

  scenario 'initial configuration' do
    new_window = nil
    within '#decision-card.edit' do
      expect(page).to have_select('Screening Decision', options: [
                                    '',
                                    'Differential response',
                                    'Information to child welfare services',
                                    'Promote to referral',
                                    'Screen out'
                                  ])
      select 'Information to child welfare services', from: 'Screening Decision'
      expect(page).to have_field('Staff name', with: '')
      select 'Promote to referral', from: 'Screening Decision'
      expect(page).to have_select('Response time', options: [
                                    '',
                                    'Immediate',
                                    '3 days',
                                    '5 days',
                                    '10 days'
                                  ])
      select 'Screen out', from: 'Screening Decision'
      expect(page).to have_select('Category', options: [
                                    '',
                                    'Evaluate out',
                                    'Information request',
                                    'Consultation',
                                    'Abandoned call',
                                    'Other'
                                  ])
      select 'Differential response', from: 'Screening Decision'
      expect(page).to have_field('Service name', with: '')
      # Values are cleared when decision is changed
      fill_in 'Service name', with: 'Do not persist'
      select 'Information to child welfare services', from: 'Screening Decision'
      expect(page).to have_field('Staff name', with: '')
      select 'Differential response', from: 'Screening Decision'
      expect(page).to have_field('Service name', with: '')
      expect(page).to have_field('Additional information', with: 'this is why it is')

      expect(page).to have_select('Access Restrictions', options: [
                                    'Do not restrict access',
                                    'Mark as Sensitive',
                                    'Mark as Sealed'
                                  ])
      expect(page).not_to have_field('Restrictions Rationale')
      select 'Mark as Sensitive', from: 'Access Restrictions'
      expect(page).to have_field('Restrictions Rationale')

      expect(page).to have_content('SDM Hotline Tool')
      expect(page).to have_content(
        'Determine Decision and Response Time by using Structured Decision Making'
      )
      expect(page).to have_content('Complete SDM')
      change_href('complete_sdm', 'localhost:3000/test')
      new_window = window_opened_by { click_link 'Complete SDM' }
    end
    within_window new_window do
      expect(current_path).to eq '3000/test'
    end
  end

  scenario 'edit and save new values' do
    screening.assign_attributes(
      screening_decision: 'differential_response',
      screening_decision_detail: 'An arbitrary string',
      additional_information: 'I changed my decision rationale',
      restrictions_rationale: 'Someone in this screening has sensitive information',
      access_restrictions: 'sensitive'
    )

    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening)))
      .and_return(json_body(screening.to_json))

    within '#decision-card.edit' do
      expect(page).to have_select('Screening Decision', selected: 'Promote to referral')
      expect(page).to have_select('Response time', selected: '3 days')
      expect(page).to have_select('Access Restrictions', selected: 'Do not restrict access')
      expect(page).to have_field('Additional information', with: 'this is why it is')
      expect(page).to have_content('Save')
      expect(page).to have_content('Cancel')
      fill_in 'Additional information', with: 'I changed my decision rationale'
      select 'Differential response', from: 'Screening Decision'
      fill_in 'Service name', with: 'An arbitrary string'
      select 'Mark as Sensitive', from: 'Access Restrictions'
      fill_in 'Restrictions Rationale', with: 'Someone in this screening has sensitive information'
      click_button 'Save'
    end
    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening)))
    ).to have_been_made
    within '#decision-card.show' do
      expect(page).to have_content('SDM Hotline Tool')
      expect(page).to have_content(
        'Determine Decision and Response Time by using Structured Decision Making'
      )
      expect(page).to have_content('Complete SDM')
      expect(page).to have_content('Screening decision')
      expect(page).to have_content('Differential response')
      expect(page).to have_content('Service name')
      expect(page).to have_content('An arbitrary string')
      expect(page).to have_content('Additional information')
      expect(page).to have_content('I changed my decision rationale')
      expect(page).to have_content('Sensitive')
      expect(page).to have_content('Someone in this screening has sensitive information')
    end
  end

  scenario 'user edits information details and click cancel' do
    within '#decision-card.edit' do
      fill_in 'Additional information', with: 'I changed my decision rationale'
      select 'Screen out', from: 'Screening Decision'
      select 'Consultation', from: 'Category'
      click_button 'Cancel'
    end

    within '#decision-card.show' do
      expect(page.find('label', text: 'Response time')[:class]).to include('required')
      expect(page).to have_content('Promote to referral')
      expect(page).to have_content('Response time')
      expect(page).to have_content('3 days')
      expect(page).to have_content('this is why it is')
    end

    # And the cancel effect is persistent
    click_link 'Edit decision'
    within '#decision-card.edit' do
      expect(page.find('label', text: 'Response time')[:class]).to include('required')
      expect(page).to have_field('Screening Decision', with: 'promote_to_referral')
      expect(page).to have_field('Response time', with: '3_days')
      expect(page).to have_field('Additional information', with: 'this is why it is')
    end
  end

  scenario 'navigate to SDM on new window' do
    within '#decision-card.edit' do
      link_from_edit = find_link('Complete SDM')
      expect(link_from_edit[:href]).to eq 'https://ca.sdmdata.org/'
      expect(link_from_edit[:target]).to eq '_blank'
      click_button 'Cancel'
    end
    within '#decision-card.show' do
      link_from_show = find_link('Complete SDM')
      expect(link_from_show[:href]).to eq 'https://ca.sdmdata.org/'
      expect(link_from_show[:target]).to eq '_blank'
    end
  end
end
