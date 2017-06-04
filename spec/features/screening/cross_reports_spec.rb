# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'cross reports' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  scenario 'adding cross reports to an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    reported_on = Date.today.to_s(:db)
    communication_method = 'Electronic Report'

    within '#cross-report-card' do
      expect(page).to_not have_content 'Communication Time and Method'
      find('label', text: 'Department of justice').click
      fill_in 'Department of justice agency name', with: 'Sac Office'
      find('label', text: 'Law enforcement').click
      fill_in 'Law enforcement agency name', with: 'LA Office'
      expect(page).to have_content 'Communication Time and Method'
      fill_in 'Cross Reported on Date', with: reported_on
      select communication_method, from: 'Communication Method'
      click_button 'Save'
    end

    expect(
      a_request(:put, intake_api_screening_url(existing_screening.id))
      .with(
        body: hash_including(
          'cross_reports' => array_including(
            hash_including(
              'agency_type' => 'Law enforcement',
              'agency_name' => 'LA Office',
              'reported_on' => reported_on,
              'communication_method' => communication_method
            ),
            hash_including(
              'agency_type' => 'Department of justice',
              'agency_name' => 'Sac Office',
              'reported_on' => reported_on,
              'communication_method' => communication_method
            )
          )
        )
      )
    ).to have_been_made
  end

  scenario 'editing cross reports to an existing screening' do
    reported_on = Date.today.to_s(:db)
    communication_method = 'Child Abuse Form'

    existing_screening.cross_reports = [
      CrossReport.new(
        agency_type: 'Department of justice',
        agency_name: 'Humboldt Office',
        communication_method: communication_method,
        reported_on: reported_on
      ),
      CrossReport.new(
        agency_type: 'Law enforcement',
        agency_name: 'LA Office',
        communication_method: communication_method,
        reported_on: reported_on
      )
    ]
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    within '#cross-report-card' do
      find('label', text: 'Department of justice').click
      expect(find(:checkbox, 'Department of justice')).to_not be_checked

      expect(find(:checkbox, 'Law enforcement')).to be_checked
      find('label', text: 'District attorney').click
      click_button 'Save'
    end

    expect(
      a_request(:put, intake_api_screening_url(existing_screening.id))
      .with(
        body: hash_including(
          'cross_reports' => array_including(
            hash_including(
              'agency_type' => 'Law enforcement',
              'agency_name' => 'LA Office',
              'reported_on' => reported_on,
              'communication_method' => communication_method
            ),
            hash_including(
              'agency_type' => 'District attorney',
              'agency_name' => nil,
              'reported_on' => reported_on,
              'communication_method' => communication_method
            )
          )
        )
      )
    ).to have_been_made
  end

  scenario 'viewing cross reports on an existing screening' do
    existing_screening.cross_reports = [
      CrossReport.new(
        agency_type: 'Department of justice',
        agency_name: 'Humboldt Office',
        communication_method: 'Child Abuse Form',
        reported_on: Date.today.to_s(:db)
      ),
      CrossReport.new(
        agency_type: 'Law enforcement',
        agency_name: 'LA Office',
        communication_method: 'Child Abuse Form',
        reported_on: Date.today.to_s(:db)
      )
    ]
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json, status: 200))
    visit screening_path(id: existing_screening.id)

    within '#cross-report-card', text: 'Cross Report' do
      expect(page).to have_content 'Department of justice'
      expect(page).to have_content 'Humboldt Office'
      expect(page).to have_content 'Law enforcement'
      expect(page).to have_content 'LA Office'
      expect(page).to have_content 'Law enforcement'
      expect(page).to have_content 'LA Office'
      expect(page).to have_content Date.today.strftime('%m/%d/%Y')
      expect(page).to have_content 'Child Abuse Form'
    end

    click_link 'Edit cross report'

    within '#cross-report-card', text: 'Cross Report' do
      expect(find(:checkbox, 'Law enforcement')).to be_checked
      expect(page).to have_field('Law enforcement agency name', with: 'LA Office')
      expect(find(:checkbox, 'Department of justice')).to be_checked
      expect(page).to have_field('Department of justice agency name', with: 'Humboldt Office')
      expect(page).to have_field('Communication Method', with: 'Child Abuse Form')
      expect(page).to have_field('Cross Reported on Date', with: Date.today.to_s(:db))
    end
  end
end
