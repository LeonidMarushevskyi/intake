# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'show cross reports' do
  scenario 'adding certain allegations makes certain cross reports required' do
    perpetrator = FactoryGirl.create(
      :participant,
      :perpetrator
    )
    victim = FactoryGirl.create(
      :participant,
      :victim
    )
    screening = FactoryGirl.create(
      :screening,
      id: 1,
      participants: [perpetrator, victim],
      allegations: [{
        screening_id: 1,
        perpetrator_id: perpetrator.id,
        victim_id: victim.id,
        allegation_types: ['Severe neglect']
      }],
      cross_reports: [
        CrossReport.new(
          agency_type: 'Law enforcement',
          agency_name: 'LA Office',
          communication_method: 'Child Abuse Form'
        )
      ]
    )
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_history_of_involvements_path(screening.id))
    ).and_return(json_body([], status: 200))
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      expect(page.find('label', text: /\ADistrict attorney\z/)[:class]).to include('required')
      expect(page.find('label', text: /\ALaw enforcement\z/)[:class]).to include('required')
      expect(page.find('label', text: 'Law enforcement agency name')[:class]).to include('required')
      expect(page.find('label', text: 'Cross Reported on Date')[:class]).to include('required')
      expect(page.find('label', text: 'Communication Method')[:class]).to include('required')
    end
  end

  scenario 'adding certain allegations does NOT make any cross reports required' do
    perpetrator = FactoryGirl.create(
      :participant,
      :perpetrator
    )
    victim = FactoryGirl.create(
      :participant,
      :victim
    )
    screening = FactoryGirl.create(
      :screening,
      id: 1,
      participants: [perpetrator, victim],
      allegations: [{
        screening_id: 1,
        perpetrator_id: perpetrator.id,
        victim_id: victim.id,
        allegation_types: ['General neglect']
      }],
      cross_reports: [
        CrossReport.new(
          agency_type: 'Law enforcement',
          agency_name: 'LA Office',
          communication_method: 'Child Abuse Form'
        )
      ]
    )
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_history_of_involvements_path(screening.id))
    ).and_return(json_body([], status: 200))
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      expect(page.find('label', text: /\ADistrict attorney\z/)[:class]).to_not include('required')
      expect(page.find('label', text: /\ALaw enforcement\z/)[:class]).to_not include('required')
      expect(page.find('label', text: 'Law enforcement agency name')[:class]).to include('required')
      expect(page.find('label', text: 'Cross Reported on Date')[:class]).to include('required')
      expect(page.find('label', text: 'Communication Method')[:class]).to include('required')
    end
  end
end
