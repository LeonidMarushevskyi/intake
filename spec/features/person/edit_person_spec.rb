# frozen_string_literal: true

require 'rails_helper'

feature 'Edit Person' do
  let(:person) do
    FactoryGirl.create(
      :person,
      date_of_birth: '05/29/1990',
      first_name: 'Homer',
      gender: 'male',
      last_name: 'Simpson',
      middle_name: 'Jay',
      name_suffix: 'esq',
      ssn: '123-23-1234',
      languages: ['Armenian'],
      races: [
        { race: 'Asian', race_detail: 'Chinese' },
        { race: 'Black or African American' }
      ],
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: 'Mexican'
      }
    )
  end

  before do
    stub_request(:get, intake_api_person_url(person.id))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
  end

  scenario 'when a user navigates to edit page' do
    visit edit_person_path(id: person.id)

    within '.card-header' do
      expect(page).to have_content 'Edit Basic Demographics Card'
    end

    within '.card-body' do
      expect(page).to have_field('First Name', with: 'Homer')
      expect(page).to have_field('Middle Name', with: 'Jay')
      expect(page).to have_field('Last Name', with: 'Simpson')
      expect(page).to have_field('Suffix', with: 'esq')
      expect(page).to have_field('Gender', with: 'male')
      has_react_select_field('Language(s)', with: ['Armenian'])
      expect(page).to have_field('Date of birth', with: '05/29/1990')
      expect(page).to have_field('Social security number', with: '123-23-1234')
      expect(page.find('input[value="Asian"]')).to be_checked
      expect(page).to have_field('Asian-race-detail', text: 'Chinese')
      expect(page.find('input[value="Black or African American"]')).to be_checked
      expect(page.find('input[value="Yes"]')).to be_checked
      expect(page).to have_field('ethnicity-detail', text: 'Mexican')
    end
    expect(page).to have_link 'Cancel'
    expect(page).to have_button 'Save'
  end

  scenario 'when a user cancels after editing and existing person' do
    visit edit_person_path(id: person.id)

    fill_in 'First Name', with: 'Lisa'
    click_link 'Cancel'

    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('Basic Demographics Card')
    end
    expect(page).to have_content 'Homer'
  end

  scenario 'when a user saves after editing and existing person' do
    visit edit_person_path(id: person.id)

    fill_in 'First Name', with: 'Lisa'
    within('#race') { find('label', text: 'Unknown').click }
    within('#ethnicity') do
      find('label', text: 'Yes').click
      find('label', text: 'Declined to answer').click
    end

    person.first_name = 'Lisa'
    person.races = [{ race: 'Unknown' }]
    person.ethnicity = { hispanic_latino_origin: 'Declined to answer' }

    stub_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, intake_api_person_url(person.id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'
    expect(a_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))).to have_been_made

    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('Basic Demographics Card')
    end
  end

  scenario 'when a user modifies an existing persons languages' do
    visit edit_person_path(id: person.id)

    fill_in_react_select 'Language(s)', with: 'English'
    fill_in_react_select 'Language(s)', with: 'Farsi'
    remove_react_select_option('Language(s)', 'Armenian')

    person.languages = %w[English Farsi]
    stub_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, intake_api_person_url(person.id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'
    expect(a_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))).to have_been_made

    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('Basic Demographics Card')
    end
  end

  scenario 'when a user modifies an existing persons race and race detail' do
    visit edit_person_path(id: person.id)

    select 'Japanese'
    find('label', text: 'White').click
    select 'Romanian'

    person.races = [
      { race: 'Asian', race_detail: 'Japanese' },
      { race: 'Black or African American' },
      { race: 'White', race_detail: 'Romanian' }
    ]

    stub_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, intake_api_person_url(person.id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'
    expect(a_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))).to have_been_made

    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('Basic Demographics Card')
    end
  end

  scenario 'when a user modifies existing person ethnicity to null' do
    visit edit_person_path(id: person.id)

    fill_in 'First Name', with: 'Lisa'
    within('#ethnicity') do
      find('label', text: 'Yes').click
    end

    person.first_name = 'Lisa'
    person.ethnicity = { hispanic_latino_origin: nil, ethnicity_detail: nil }

    stub_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, intake_api_person_url(person.id))
      .and_return(status: 200,
                  body: person.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'
    expect(a_request(:put, intake_api_person_url(person.id))
      .with(body: person.to_json(except: :id))).to have_been_made

    expect(page).to have_current_path(person_path(id: person.id))
    within '.card-header' do
      expect(page).to have_content('Basic Demographics Card')
    end
    expect(page).to_not have_content('Yes')
  end
end
