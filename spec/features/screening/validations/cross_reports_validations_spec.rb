# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'factory_bot'

feature 'Cross Reports Validations' do
  let(:screening) do
    FactoryBot.create(
      :screening, cross_reports: [
        FactoryBot.create(
          :cross_report,
          county_id: 'c41',
          agencies: [
            FactoryBot.create(:agency, id: nil, type: 'COUNTY_LICENSING')
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
        validate_message_as_user_interacts_with_date_field(
          card_name: 'cross-report',
          field: 'Cross Reported on Date',
          error_message: 'Please enter a cross-report date.',
          invalid_value: '',
          valid_value: 20.years.ago
        )
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
                  { type: 'COUNTY_LICENSING', id: 'GPumYGQ00F' }
                ]
              ]
            }
          ) do
            within '#cross-report-card.edit' do
              select 'Hoverment Agency', from: 'County licensing agency name'
            end
          end
        end

        scenario 'displays no error on initial load' do
          should_not_have_content error_message, inside: '#cross-report-card.edit'
        end

        scenario 'displays error on blur' do
          select '', from: 'County licensing agency name'
          blur_field
          should_have_content error_message, inside: '#cross-report-card.edit'
        end

        scenario 'removes error on change' do
          select '', from: 'County licensing agency name'
          blur_field
          should_have_content error_message, inside: '#cross-report-card.edit'
          select 'Hoverment Agency', from: 'County licensing agency name'
          should_not_have_content error_message, inside: '#cross-report-card.edit'
        end

        scenario 'shows error on save page' do
          stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
            .and_return(json_body(screening.to_json, status: 201))

          select '', from: 'County licensing agency name'
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
          stub_and_visit_edit_screening(screening)
          stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
            .and_return(json_body(screening.to_json, status: 201))
        end
        scenario 'shows no error when filled in' do
          select 'Hoverment Agency', from: 'County licensing agency name'
          blur_field
          should_not_have_content error_message, inside: '#cross-report-card .card-body'
          save_card('cross-report')
          should_not_have_content error_message, inside: '#cross-report-card .card-body'
        end
      end
    end
  end
end
