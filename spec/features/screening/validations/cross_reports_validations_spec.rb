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
          county_id: 'c41',
          agencies: [
            FactoryGirl.create(:agency, id: nil, type: 'DEPARTMENT_OF_JUSTICE')
          ]
        )
      ]
    )
  end

  context 'on the edit page' do
    context 'reported_on field' do
      before do
        stub_county_agencies('c41')
        stub_and_visit_edit_screening(screening)
      end

      it 'shows reported_on validation on blur' do
        within '#cross-report-card' do
          expect(page).not_to have_content('Please enter a cross-report date.')
          fill_in_datepicker 'Cross Reported on Date', with: '', blur: false
          expect(page).not_to have_content('Please enter a cross-report date.')
          blur_field
          expect(page).to have_content('Please enter a cross-report date.')
        end
      end
    end

    context 'agency name field' do
      let(:error_message) { 'Please enter an agency name.' }
      before do
        stub_county_agencies('c41')
        stub_and_visit_edit_screening(screening)
      end

      context 'save without an agency' do
        scenario 'show card displays errors until user adds a value' do
          validate_message_as_user_interacts_with_card(
            invalid_screening: screening,
            card_name: 'cross-report',
            error_message: error_message,
            screening_updates:
            {
              cross_reports: [
                county_id: 'c41',
                agencies: [
                  { type: 'DEPARTMENT_OF_JUSTICE', id: 'EYIS9Nh75C' }
                ]
              ]
            }
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
      end

      context 'save with an agency' do
        before do
          stub_county_agencies('c41')
          screening.cross_reports[0].agencies[0].id = 'EYIS9Nh75C'
          stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
            .and_return(json_body(screening.to_json, status: 200))
          stub_and_visit_edit_screening(screening)
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
end
