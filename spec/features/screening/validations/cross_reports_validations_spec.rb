# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Cross Reports Validations' do
  let(:screening) do
    FactoryGirl.create(
      :screening, cross_reports: [
        FactoryGirl.create(
          :cross_report,
          :invalid,
          county: 'c41',
          agency_type: 'DEPARTMENT_OF_JUSTICE'
        )
      ]
    )
  end

  context 'on the edit page' do
    before do
      stub_county_agencies('c41')
      stub_and_visit_edit_screening(screening)
    end

    context 'reported_on field' do
      it 'shows reported_on validation on blur' do
        within '#cross-report-card' do
          expect(page).not_to have_content('Please enter a cross-report date.')
          fill_in('Cross Reported on Date', with: '')
          expect(page).not_to have_content('Please enter a cross-report date.')
          blur_field
          expect(page).to have_content('Please enter a cross-report date.')
        end
      end
    end

    context 'agency name field' do
      let(:error_message) { 'Please enter an agency name.' }

      scenario 'show card displays errors until user adds a value' do
        validate_message_as_user_interacts_with_card(
          invalid_screening: screening,
          card_name: 'cross-report',
          error_message: error_message,
          screening_updates:
          { cross_reports:
            [county: 'c41', agency_type: 'DEPARTMENT_OF_JUSTICE', agency_code: 'EYIS9Nh75C'] }
        ) do
          within '#cross-report-card.edit' do
            select 'DOJ Agency', from: 'Department of justice agency name'
          end
        end
      end

      scenario 'displays no error on initial load' do
        should_not_have_content error_message, inside: '#cross-report-card.edit'
      end

      scenario 'displays error on blur' do
        select '', from: 'Department of justice agency name'
        blur_field
        should_have_content error_message, inside: '#cross-report-card.edit'
      end

      scenario 'removes error on change' do
        select '', from: 'Department of justice agency name'
        blur_field
        should_have_content error_message, inside: '#cross-report-card.edit'
        select 'DOJ Agency', from: 'Department of justice agency name'
        should_not_have_content error_message, inside: '#cross-report-card.edit'
      end

      scenario 'shows error on save page' do
        select '', from: 'Department of justice agency name'
        blur_field
        should_have_content error_message, inside: '#cross-report-card.edit'
        save_card('cross-report')
        should_have_content error_message, inside: '#cross-report-card .card-body'
      end

      scenario 'shows no error when filled in' do
        select 'DOJ Agency', from: 'Department of justice agency name'
        blur_field
        should_not_have_content error_message, inside: '#cross-report-card .card-body'
        save_card('cross-report')
        should_not_have_content error_message, inside: '#cross-report-card .card-body'
      end
    end
  end
end
