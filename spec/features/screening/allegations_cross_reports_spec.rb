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
          county_id: 'c41',
          agencies: [
            { type: 'LAW_ENFORCEMENT', id: 'LAOFFCODE' }
          ],
          method: 'Child Abuse Form'
        )
      ]
    )
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      expect(page).to have_content('must be cross-reported to law enforcement')
      expect(page.find('label', text: /\ADistrict attorney\z/)[:class]).to include('required')
      expect(page.find('label', text: /\ALaw enforcement\z/)[:class]).to include('required')
      expect(page.find('label', text: 'Law enforcement agency name')[:class]).to include('required')
      expect(page.find('label', text: 'Cross Reported on Date')[:class]).to include('required')
      expect(page.find('label', text: 'Communication Method')[:class]).to include('required')
      click_button 'Cancel'
    end

    within '#cross-report-card.show' do
      expect(page).to have_content('must be cross-reported to law enforcement')
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
    victim2 = FactoryGirl.create(
      :participant,
      :victim
    )
    screening = FactoryGirl.create(
      :screening,
      id: 1,
      participants: [perpetrator, victim, victim2],
      allegations: [
        {
          screening_id: 1,
          perpetrator_id: perpetrator.id,
          victim_id: victim.id,
          allegation_types: ['General neglect']
        },
        {
          screening_id: 1,
          perpetrator_id: perpetrator.id,
          victim_id: victim2.id,
          allegation_types: ['At risk, sibling abused']
        }
      ],
      cross_reports: [
        CrossReport.new(
          county_id: 'c41',
          agencies: [
            { type: 'LAW_ENFORCEMENT', id: 'LAOFFCODE' }
          ],
          method: 'Child Abuse Form'
        )
      ]
    )
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      expect(page).to_not have_content('must be cross-reported to law enforcement')
      expect(page.find('label', text: /\ADistrict attorney\z/)[:class]).to_not include('required')
      expect(page.find('label', text: /\ALaw enforcement\z/)[:class]).to_not include('required')
      expect(page.find('label', text: 'Law enforcement agency name')[:class]).to include('required')
      expect(page.find('label', text: 'Cross Reported on Date')[:class]).to include('required')
      expect(page.find('label', text: 'Communication Method')[:class]).to include('required')
    end
  end

  scenario 'when allegations are required and user selects and unselects cross report options' do
    perpetrator = FactoryGirl.create(
      :participant,
      :perpetrator
    )
    victim = FactoryGirl.create(
      :participant,
      :victim
    )
    victim2 = FactoryGirl.create(
      :participant,
      :victim
    )
    screening = FactoryGirl.create(
      :screening,
      id: 1,
      participants: [perpetrator, victim, victim2],
      allegations: [
        {
          screening_id: 1,
          perpetrator_id: perpetrator.id,
          victim_id: victim.id,
          allegation_types: ['Severe neglect']
        },
        {
          screening_id: 1,
          perpetrator_id: perpetrator.id,
          victim_id: victim2.id,
          allegation_types: ['At risk, sibling abused']
        }
      ],
      cross_reports: []
    )
    stub_county_agencies('c41')
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      select 'State of California', from: 'County'
      expect(page).to have_content('must be cross-reported to law enforcement')
      find('label', text: /\ADistrict attorney\z/).click
      expect(page).to have_content('must be cross-reported to law enforcement')
      find('label', text: /\ALaw enforcement\z/).click
      expect(page).to_not have_content('must be cross-reported to law enforcement')
    end

    screening.cross_reports << { county_id: 'c41', agencies: [{ type: 'DISCTRICT_ATTORNEY' }] }
    screening.cross_reports << { county_id: 'c41', agencies: [{ type: 'LAW_ENFORCEMENT' }] }
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    within '#cross-report-card.edit' do
      click_button 'Save'
    end

    within '#cross-report-card.show' do
      expect(page).to_not have_content('must be cross-reported to law enforcement')
    end
  end
end
