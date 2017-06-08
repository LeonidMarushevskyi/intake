# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'show cross reports' do
  SERIOUS_ALLEGATIONS = [
    'Severe neglect',
    'Physical abuse',
    'Sexual abuse',
    'Emotional abuse',
    'Exploitation',
    'At risk, sibling abused'
  ].freeze
  scenario 'adding certain allegations makes certain cross reports required' do
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
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      expect(page.find('label', text: 'District attorney')[:class]).to_not include('required')
      expect(page.find('label', text: 'Law enforcement')[:class]).to_not include('required')
    end

    SERIOUS_ALLEGATIONS.each do |allegation|
      within '#allegations-card' do
        fill_in_react_select "allegations_#{bart.id}_#{marge.id}", with: allegation
      end

      within '#cross-report-card.edit' do
        expect(page.find('label', text: 'District attorney')[:class]).to include('required')
        expect(page.find('label', text: 'Law enforcement')[:class]).to include('required')
      end

      within '#allegations-card' do
        remove_react_select_option "allegations_#{bart.id}_#{marge.id}", allegation
      end

      within '#cross-report-card.edit' do
        expect(page.find('label', text: 'District attorney')[:class]).to_not include('required')
        expect(page.find('label', text: 'Law enforcement')[:class]).to_not include('required')
      end
    end
  end
end
