# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Cross Reports Validations' do
  let(:screening) do
    FactoryGirl.create(
      :screening, cross_reports: [
        FactoryGirl.create(:cross_report, :invalid, agency_type: 'Department of justice')
      ]
    )
  end

  context 'on the edit page' do
    before do
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
            [agency_type: 'Department of justice', agency_name: 'LA Office'] }
        ) do
          within '#cross-report-card.edit' do
            fill_in 'Department of justice agency name', with: 'LA Office'
          end
        end
      end

      scenario 'displays no error on initial load' do
        should_not_have_content error_message, inside: '#cross-report-card.edit'
      end

      scenario 'displays error on blur' do
        fill_in 'Department of justice agency name', with: ''
        blur_field
        should_have_content error_message, inside: '#cross-report-card.edit'
      end

      scenario 'removes error on change' do
        fill_in 'Department of justice agency name', with: ''
        blur_field
        should_have_content error_message, inside: '#cross-report-card.edit'
        fill_in 'Department of justice agency name', with: 'S.H.I.E.L.D.'
        should_not_have_content error_message, inside: '#cross-report-card.edit'
      end

      scenario 'shows error on save page' do
        fill_in 'Department of justice agency name', with: ''
        blur_field
        should_have_content error_message, inside: '#cross-report-card.edit'
        save_card('cross-report')
        should_have_content error_message, inside: '#cross-report-card .card-body'
      end

      scenario 'shows no error when filled in' do
        fill_in 'Department of justice agency name', with: 'Justice League'
        blur_field
        should_not_have_content error_message, inside: '#cross-report-card .card-body'
        save_card('cross-report')
        should_not_have_content error_message, inside: '#cross-report-card .card-body'
      end
    end
  end
end
