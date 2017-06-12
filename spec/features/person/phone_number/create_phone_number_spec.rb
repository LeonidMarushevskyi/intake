# frozen_string_literal: true

require 'rails_helper'

feature 'Create Phone Number' do
  scenario 'add and remove phone numbers on a new person' do
    person = FactoryGirl.build(
      :person,
      phone_numbers: [
        {
          id: nil,
          number: '917-578-2010',
          type: 'Work'
        },
        {
          id: nil,
          number: '568-387-8844',
          type: nil
        }
      ]
    )
    visit new_person_path

    click_button 'Add new phone number'

    within '#phone-numbers' do
      fill_in 'Phone Number', with: '917-578-2010'
      select 'Work', from: 'Phone Number Type'
      expect(page).to have_link('Delete phone number')
    end

    click_button 'Add new phone number'

    within '#phone-numbers' do
      within all('.list-item').last do
        fill_in 'Phone Number', with: '789-578-2014'
        select 'Home', from: 'Phone Number Type'
        click_link 'Delete phone number'
      end
    end

    click_button 'Add new phone number'

    within '#phone-numbers' do
      within all('.list-item').last do
        fill_in 'Phone Number', with: '568-387-8844'
        select '', from: 'Phone Number Type'
      end
    end

    stub_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id))
      .and_return(json_body(person.as_json.merge(id: '1').to_json, status: 201))
    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path('1')))
      .and_return(json_body(person.as_json.merge(id: '1').to_json, status: 200))

    click_button 'Save'

    expect(a_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id)))
      .to have_been_made

    expect(page).to have_current_path(person_path('1'))
  end

  scenario 'create a person with empty phone number' do
    person = FactoryGirl.build(:person)
    created_person = FactoryGirl.create(:person, person.as_json)

    # the following stub allows the user to transistion to the person show page
    stub_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id))
      .and_return(json_body(created_person.to_json, status: 201))
    visit new_person_path
    click_button 'Add new phone number'

    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(created_person.id)))
      .and_return(json_body(created_person.to_json, status: 200))

    click_button 'Save'

    expect(a_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id)))
      .to have_been_made

    expect(page).to have_current_path(person_path(person.id))
  end
end
