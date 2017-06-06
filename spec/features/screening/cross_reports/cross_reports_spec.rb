# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'show cross reports' do
  SERIOUS_ALLEGATIONS = [
    'Severe Neglect',
    'Physical Abuse',
    'Sexual Abuse',
    'Emotional Abuse',
    'Exploitation',
    'Sibling at Risk'
  ]
  scenario 'adding certain allegations makes cross reports required' do
    crossReportRequiredMessage = 'Temp required until UX provides text'
    marge = FactoryGirl.create(
      :participant,
      :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil
    )
    bart = FactoryGirl.create(
      :participant,
      first_name: 'Bart',
      last_name: 'Simpson',
      date_of_birth: nil,
      roles: %w[Victim]
    )
    screening = FactoryGirl.create(:screening, participants: [marge, bart])
    stub_request(:get, intake_api_screening_url(screening.id))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(
      :get,
      intake_api_history_of_involvements_url(screening.id)
    ).and_return(json_body([].to_json, status: 200))
    visit screening_path(id: screening.id)

    within '#cross-report-card.show' do
      expect(page).to have_no_content(crossReportRequiredMessage)
    end

    SERIOUS_ALLEGATIONS.each{ |allegation|
      within '#allegations-card' do
        click_link 'Edit'
        puts allegation
        fill_in_react_select "allegations_#{bart.id}_#{marge.id}", with: allegation
      end

      within '#cross-report-card.show' do
        expect(page).to have_content(crossReportRequiredMessage)
        click_link 'Edit'
      end

      within '#cross-report-card.edit' do
        expect(page).to have_content(crossReportRequiredMessage)
      end

      within '#allegations-card' do
        remove_react_select_option "allegations_#{bart.id}_#{marge.id}", allegation
      end

      within '#cross-report-card.edit' do
        expect(page).to have_no_content(crossReportRequiredMessage)
        click_button 'Cancel'
      end

      within '#cross-report-card.show' do
        expect(page).to have_no_content(crossReportRequiredMessage)
      end
    }
  end
end
