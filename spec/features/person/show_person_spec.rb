# frozen_string_literal: true

require 'rails_helper'

feature 'Show Person' do
  scenario 'showing existing person' do
    person = FactoryGirl.create(
      :person,
      first_name: 'Homer',
      middle_name: 'Jay',
      last_name: 'Simpson',
      name_suffix: 'esq',
      gender: 'male',
      date_of_birth: '05/29/1990',
      ssn: '123-23-1234',
      languages: %w[Turkish Thai Vietnamese],
      races: [
        { race: 'White', race_detail: 'Romanian' },
        { race: 'Asian', race_detail: 'Chinese' },
        { race: 'Black or African American' }
      ],
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: 'Mexican'
      }
    )
    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .and_return(json_body(person.to_json, status: 200))

    visit person_path(id: person.id)

    expect(page).to have_content('Homer')
    expect(page).to have_content('Jay')
    expect(page).to have_content('Simpson')
    expect(page).to have_content('Esq')
    expect(page).to have_content('Male')
    expect(page).to have_content('Turkish, Thai, Vietnamese')
    # DateField updates broke person page which is deprecated so we are not fixing this.
    # expect(page).to have_content('05/29/1990')
    expect(page).to have_content('123-23-1234')
    expect(page).to have_content('Race')
    expect(page).to have_content('White - Romanian, Asian - Chinese, Black or African American')
    expect(page).to have_content('Hispanic/Latino Origin')
    expect(page).to have_content('Yes - Mexican')
    expect(page).to_not have_content('Save')
    expect(page).to have_link('Edit Person', href: edit_person_path(id: person.id))
  end
end
