# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'cross reports' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  scenario 'adding cross reports to an existing screening' do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    reported_on = Date.today
    communication_method = 'Electronic Report'

    within '#cross-report-card' do
      expect(page).to_not have_content 'Communication Time and Method'
      expect(page).to have_content 'County'
      select 'Sacramento', from: 'County'
      find('label', text: /\ADepartment of justice\z/).click
      fill_in 'Department of justice agency name', with: 'Sac Office'
      find('label', text: /\ALaw enforcement\z/).click
      fill_in 'Law enforcement agency name', with: 'LA Office'
      expect(page).to have_content 'Communication Time and Method'
      fill_in_datepicker 'Cross Reported on Date', with: reported_on
      expect(find_field('Cross Reported on Date').value).to eq(reported_on.strftime('%m/%d/%Y'))
      select communication_method, from: 'Communication Method'
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(
        body: hash_including(
          'cross_reports' => array_including(
            hash_including(
              'county' => 'sacramento',
              'agency_type' => 'Law enforcement',
              'agency_name' => 'LA Office',
              'reported_on' => reported_on.to_s(:db),
              'communication_method' => communication_method
            ),
            hash_including(
              'county' => 'sacramento',
              'agency_type' => 'Department of justice',
              'agency_name' => 'Sac Office',
              'reported_on' => reported_on.to_s(:db),
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
        county: 'sacramento',
        agency_type: 'Department of justice',
        agency_name: 'Humboldt Office',
        communication_method: communication_method,
        reported_on: reported_on
      ),
      CrossReport.new(
        county: 'sacramento',
        agency_type: 'Law enforcement',
        agency_name: 'LA Office',
        communication_method: communication_method,
        reported_on: reported_on
      )
    ]
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    within '#cross-report-card' do
      expect(page).to have_select('County', selected: 'Sacramento')
      select 'Lake', from: 'County'
      expect(page).to have_select('County', selected: 'Lake')

      expect(find(:checkbox, 'Department of justice')).to_not be_checked

      find('label', text: /\ALaw enforcement\z/).click
      expect(find(:checkbox, 'Law enforcement')).to be_checked

      fill_in 'Law enforcement agency name', with: 'LA Office'
      find('label', text: /\ADistrict attorney\z/).click
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(
        body: hash_including(
          'cross_reports' => array_including(
            hash_including(
              'county' => 'lake',
              'agency_type' => 'Law enforcement',
              'agency_name' => 'LA Office',
              'reported_on' => reported_on,
              'communication_method' => communication_method
            ),
            hash_including(
              'county' => 'lake',
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
        county: 'sacramento',
        agency_type: 'Department of justice',
        agency_name: 'Humboldt Office',
        communication_method: 'Child Abuse Form',
        reported_on: Date.today.to_s(:db)
      ),
      CrossReport.new(
        county: 'sacramento',
        agency_type: 'Law enforcement',
        agency_name: 'LA Office',
        communication_method: 'Child Abuse Form',
        reported_on: Date.today.to_s(:db)
      )
    ]
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    visit screening_path(id: existing_screening.id)

    within '#cross-report-card', text: 'Cross Report' do
      expect(page).to_not have_content 'County'
      expect(page).to_not have_content 'Sacramento'
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
      expect(page).to have_select('County', selected: 'Sacramento')
      expect(find(:checkbox, 'Law enforcement')).to be_checked
      expect(page).to have_field('Law enforcement agency name', with: 'LA Office')
      expect(find(:checkbox, 'Department of justice')).to be_checked
      expect(page).to have_field('Department of justice agency name', with: 'Humboldt Office')
      expect(page).to have_field('Communication Method', with: 'Child Abuse Form')
      expect(page).to have_field('Cross Reported on Date', with: Date.today.strftime('%m/%d/%Y'))
    end
  end

  scenario 'viewing empty cross reports on an existing screening' do
    stub_request(
      :get,
      intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    visit screening_path(id: existing_screening.id)

    within '#cross-report-card', text: 'Cross Report' do
      expect(page).to_not have_content 'County'
      expect(page).to_not have_content 'Communication Time and Method'
      expect(page).to_not have_content 'Cross Reported on Date'
      expect(page).to_not have_content 'Communication Method'
    end
  end

  scenario 'communication method and time fields are cached' do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    reported_on = Date.today
    communication_method = 'Child Abuse Form'

    within '#cross-report-card' do
      select 'State of California', from: 'County'
      find('label', text: /\ADepartment of justice\z/).click
      fill_in_datepicker 'Cross Reported on Date', with: reported_on
      select communication_method, from: 'Communication Method'
      find('label', text: /\ADepartment of justice\z/).click
      find('label', text: /\ALaw enforcement\z/).click
      expect(page).to have_field('Cross Reported on Date', with: reported_on.strftime('%m/%d/%Y'))
      expect(page).to have_field('Communication Method', with: communication_method)

      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(
        body: hash_including(
          'cross_reports' => array_including(
            hash_including(
              'agency_type' => 'Law enforcement',
              'agency_name' => nil,
              'reported_on' => reported_on.to_s(:db),
              'communication_method' => communication_method
            )
          )
        )
      )
    ).to have_been_made
  end

  scenario 'communication method and time fields are cleared from cache after save' do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    reported_on = Date.today
    communication_method = 'Child Abuse Form'

    within '#cross-report-card' do
      select 'State of California', from: 'County'
      find('label', text: /\ADepartment of justice\z/).click
      fill_in_datepicker 'Cross Reported on Date', with: reported_on
      select communication_method, from: 'Communication Method'
      find('label', text: /\ADepartment of justice\z/).click
      click_button 'Save'
    end

    click_link 'Edit cross report'

    within '#cross-report-card' do
      select 'State of California', from: 'County'
      find('label', text: /\ADepartment of justice\z/).click
      expect(page).to have_field('Cross Reported on Date', with: '')
      expect(page).to have_field('Communication Method', with: '')
    end
  end
end
