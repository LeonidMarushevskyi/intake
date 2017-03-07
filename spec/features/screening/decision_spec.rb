# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'decision card' do
  let(:screening) do
    FactoryGirl.create(
      :screening,
      screening_decision: 'evaluate_out',
      response_time: 'immediate',
      decision_rationale: 'this is why it is'
    )
  end

  before(:each) do
    stub_request(:get, api_screening_path(screening.id))
      .and_return(body: screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: screening.id)
  end

  scenario 'edit and save new values' do
    screening.assign_attributes(
      screening_decision: 'accept_for_investigation',
      response_time: 'within_twenty_four_hours',
      decision_rationale: 'I changed my decision rationale'
    )

    stub_request(:put, api_screening_path(screening.id))
      .with(json_body(screening.to_json(except: :id)))
      .and_return(json_body(screening.to_json))

    within '#decision-card.edit' do
      expect(page).to have_field('Response Time', with: 'immediate')
      expect(page).to have_field('Screening Decision', with: 'evaluate_out')
      expect(page).to have_field('Decision Rationale', with: 'this is why it is')
      expect(page).to have_content('Save')
      expect(page).to have_content('Cancel')
      fill_in 'Decision Rationale', with: 'I changed my decision rationale'
      select 'Within 24 hours', from: 'Response Time'
      select 'Accept for Investigation', from: 'Screening Decision'
      click_button 'Save'
    end

    expect(
      a_request(:put, api_screening_path(screening.id))
      .with(json_body(screening.to_json(except: :id)))
    ).to have_been_made
  end

  scenario 'user edits information details and click cancel' do
    within '#decision-card.edit' do
      fill_in 'Decision Rationale', with: 'I changed my decision rationale'
      select 'Within 24 hours', from: 'Response Time'
      select 'Accept for Investigation', from: 'Screening Decision'
      click_button 'Cancel'
    end

    within '#decision-card.show' do
      expect(page).to have_content('Immediate')
      expect(page).to have_content('Evaluate Out')
      expect(page).to have_content('this is why it is')
    end

    # And the cancel effect is persistent
    click_link 'Edit decision'
    within '#decision-card.edit' do
      expect(page).to have_field('Response Time', with: 'immediate')
      expect(page).to have_field('Screening Decision', with: 'evaluate_out')
      expect(page).to have_field('Decision Rationale', with: 'this is why it is')
    end
  end
end
