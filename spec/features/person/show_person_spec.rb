# frozen_string_literal: true
require 'rails_helper'

feature 'Show Person' do
  scenario 'showing existing person' do
    person = FactoryGirl.create(
      :person,
      first_name: 'Homer',
      last_name: 'Simpson',
      gender: 'male',
      date_of_birth: '05/29/1990',
      ssn: '123-23-1234',
      address: FactoryGirl.create(
        :address,
        street_address: '123 fake st',
        city: 'Springfield',
        state: 'NY',
        zip: '12345'
      )
    )
    faraday_helper do |stub|
      stub.get("/api/v1/people/#{person.id}") do |_|
        [200, {}, person.as_json]
      end
    end

    visit person_path(id: person.id)

    expect(page).to have_content('Homer')
    expect(page).to have_content('Simpson')
    expect(page).to have_content('Male')
    expect(page).to have_content('05/29/1990')
    expect(page).to have_content('123-23-1234')
    expect(page).to have_content('123 fake st')
    expect(page).to have_content('Springfield')
    expect(page).to have_content('New York')
    expect(page).to have_content('12345')
    expect(page).to_not have_content('Save')
    expect(page).to have_link('Edit Person', href: edit_person_path(id: person.id))
  end
end
