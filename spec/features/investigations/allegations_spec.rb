# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Show Investigation' do
  scenario 'user navigates to the investigation show page' do
    investigation_id = '12345'
    allegations = [
      {
        victim: { first_name: 'John', last_name: 'Smith' },
        perpetrator: { first_name: 'Jane', last_name: 'Doe' },
        allegation_type: 'ALLEGATION_TYPE_1'
      },
      {
        victim: { first_name: 'Sally', last_name: 'Smith' },
        perpetrator: { first_name: 'John', last_name: 'Doe' },
        allegation_type: 'ALLEGATION_TYPE_2'
      }
    ]
    stub_request(
      :get, ferb_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
    ).and_return(json_body({ allegations: allegations }.to_json, status: 200))
    visit investigation_path(id: investigation_id)

    within '.card.show', text: 'Allegations' do
      within 'tbody' do
        rows = page.all('tr')

        within rows.first do
          expect(page).to have_content 'John Smith'
          expect(page).to have_content 'Jane Doe'
          expect(page).to have_content 'Allegation Type 1'
        end

        within rows.last do
          expect(page).to have_content 'Sally Smith'
          expect(page).to have_content 'John Doe'
          expect(page).to have_content 'Allegation Type 2'
        end
      end
    end
  end
end
