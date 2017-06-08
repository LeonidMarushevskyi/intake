# frozen_string_literal: true

require 'rails_helper'

feature 'Edit Phone Number' do
  scenario 'edit an existing persons phone number' do
    person = FactoryGirl.create(
      :person,
      phone_numbers: [{
        id: '1',
        number: '917-578-2010',
        type: 'Work'
      }],
      addresses: []
    )

    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_person_path(id: person.id)

    within '#phone-numbers' do
      expect(page).to have_field('Phone Number', with: '917-578-2010')
      expect(page).to have_field('Phone Number Type', with: 'Work')

      fill_in 'Phone Number', with: '917-578-1234'
      select 'Home', from: 'Phone Number Type'
    end

    click_button 'Add new phone number'

    within '#phone-numbers' do
      within all('.list-item').last do
        fill_in 'Phone Number', with: '330-789-4587'
        select 'Work', from: 'Phone Number Type'
      end
    end

    click_button 'Add new phone number'

    within '#phone-numbers' do
      within all('.list-item').last do
        fill_in 'Phone Number', with: '879-456-7895'
        select '', from: 'Phone Number Type'
      end
    end

    person.phone_numbers.first.number = '917-578-1234'
    person.phone_numbers.first.type = 'Home'
    person.phone_numbers << PhoneNumber.new(
      number: '330-789-4587',
      type: 'Work'
    )
    person.phone_numbers << PhoneNumber.new(
      number: '879-456-7895',
      type: nil
    )

    stub_request(:put, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .with(body: person.to_json(except: :id))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'

    expect(a_request(:put, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .with(body: person.to_json(except: :id))).to have_been_made
  end

  scenario 'delete an existing persons phone number' do
    person = FactoryGirl.create(
      :person,
      id: '1',
      phone_numbers: [{
        id: '1',
        number: '917-578-2010',
        type: 'Work'
      }],
      addresses: []
    )

    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_person_path(id: person.id)

    within '#phone-numbers' do
      expect(page).to have_field('Phone Number', with: '917-578-2010')
      expect(page).to have_field('Phone Number Type', with: 'Work')
      click_link 'Delete phone number'
    end

    within '#phone-numbers' do
      expect(page).to_not have_field('Phone Number', with: '917-578-2010')
      expect(page).to_not have_field('Phone Number Type', with: 'Work')
    end

    person.phone_numbers = []
    stub_request(:put, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .with(body: person.to_json(except: :id))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'
    expect(a_request(:put, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .with(body: person.to_json(except: :id))).to have_been_made
  end
end
