# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'show cross reports' do
  scenario 'adding certain allegations makes certain cross reports required' do
    marge = FactoryGirl.create(
      :participant,
      :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson'
    )
    bart = FactoryGirl.create(
      :participant,
      :victim,
      first_name: 'Bart',
      last_name: 'Simpson'
    )
    screening = FactoryGirl.create(
      :screening,
      id: 1,
      participants: [marge, bart],
      allegations: [{
        screening_id: 1,
        perpetrator_id: marge.id,
        perpetrator: marge,
        victim_id: bart.id,
        victim: bart,
        allegation_types: ['Severe neglect']
      }]
    )
    stub_request(:get, intake_api_screening_url(screening.id))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(
      :get,
      intake_api_history_of_involvements_url(screening.id)
    ).and_return(json_body([].to_json, status: 200))
    visit edit_screening_path(id: screening.id)

    within '#cross-report-card.edit' do
      expect(page.find('label', text: 'District attorney')[:class]).to include('required')
      expect(page.find('label', text: 'Law enforcement')[:class]).to include('required')
    end
  end
end
