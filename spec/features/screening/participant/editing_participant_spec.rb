# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Person' do
  let(:new_ssn) { '123-23-1234' }
  let(:old_ssn) { '555-56-7895' }
  let(:marge_roles) { %w[Victim Perpetrator] }
  let(:phone_number) { FactoryGirl.create(:phone_number, number: '1234567890', type: 'Work') }
  let(:marge) do
    FactoryGirl.create(
      :participant,
      :with_complete_address,
      phone_numbers: [phone_number],
      middle_name: 'Jacqueline',
      name_suffix: 'sr',
      ssn: old_ssn,
      sealed: false,
      sensitive: true,
      races: [
        { race: 'Asian', race_detail: 'Hmong' }
      ],
      roles: marge_roles,
      languages: ['Russian'],
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: ['Mexican']
      }
    )
  end
  let(:marge_formatted_name) do
    name_suffix = marge.name_suffix.capitalize
    "#{marge.first_name} #{marge.middle_name} #{marge.last_name}, #{name_suffix}"
  end
  let(:homer) { FactoryGirl.create(:participant, :with_complete_address, ssn: nil) }
  let(:screening) { FactoryGirl.create(:screening, participants: [marge, homer]) }

  before do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)
  end

  scenario 'character limitations by field',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(marge.id) do
      fill_in 'Zip', with: '9i5%6Y1 8-_3.6+9*7='
      expect(page).to have_field('Zip', with: '95618-3697')
      fill_in 'Zip', with: '9i5%6Y1 8'
      expect(page).to have_field('Zip', with: '95618')
    end
  end

  context 'editing and saving basic person information' do
    scenario 'saves the person information' do
      visit edit_screening_path(id: screening.id)
      within edit_participant_card_selector(marge.id) do
        within '.card-header' do
          expect(page).to have_content('Sensitive')
          expect(page).to have_content marge_formatted_name
          expect(page).to have_button 'Delete person'
        end
        within '.card-body' do
          table_description = marge.legacy_descriptor.legacy_table_description
          ui_id = marge.legacy_descriptor.legacy_ui_id
          has_react_select_field 'Role', with: %w[Victim Perpetrator]
          expect(page).to have_content("#{table_description} ID #{ui_id} in CWS-CMS")
          expect(page).to have_field('First Name', with: marge.first_name)
          expect(page).to have_field('Middle Name', with: marge.middle_name)
          expect(page).to have_field('Last Name', with: marge.last_name)
          expect(page).to have_field('Suffix', with: marge.name_suffix)
          expect(page).to have_field('Social security number', with: marge.ssn)

          fill_in 'First Name', with: 'new first name'
          fill_in 'Middle Name', with: 'new middle name'
          fill_in 'Last Name', with: 'new last name'
          select 'Sr', from: 'Suffix'
          fill_in 'Social security number', with: 111_111_111
        end
        click_button 'Save'
      end

      expect(
        a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(
          body: hash_including(
            first_name: 'new first name',
            middle_name: 'new middle name',
            last_name: 'new last name',
            name_suffix: 'sr',
            ssn: '111-11-1111'
          )
        )
      ).to have_been_made
    end
  end

  context 'editing and saving person phone numbers' do
    scenario 'saves the person information' do
      visit edit_screening_path(id: screening.id)
      within edit_participant_card_selector(marge.id) do
        within '.card-body' do
          expect(page).to have_field('Phone Number', with: '(123)456-7890')
          expect(page).to have_field('Phone Number Type', with: phone_number.type)

          click_button 'Add new phone number'

          within all('.row.list-item').last do
            fill_in 'Phone Number', with: '9876543210'
            select 'Cell', from: 'Phone Number Type'
          end
        end
        click_button 'Save'
      end

      expect(
        a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(
          body: hash_including(
            'phone_numbers' => array_including(
              hash_including('number' => phone_number.number, 'type' => phone_number.type),
              hash_including('number' => '(987)654-3210', 'type' => 'Cell')
            )
          )
        )
      ).to have_been_made
    end
  end

  scenario 'editing and saving a participant for a screening saves only the relevant participant',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(marge.id) do
      within '.card-header' do
        expect(page).to have_content('Sensitive')
        expect(page).to have_content marge_formatted_name
        expect(page).to have_button 'Delete person'
      end

      within '.card-body' do
        table_description = marge.legacy_descriptor.legacy_table_description
        ui_id = marge.legacy_descriptor.legacy_ui_id
        expect(page).to have_content("#{table_description} ID #{ui_id} in CWS-CMS")
        expect(page).to have_selector("#address-#{marge.addresses.first.id}")
        expect(page).to have_field('Phone Number', with: '(123)456-7890')
        expect(page).to have_field('Phone Number Type', with: 'Work')
        expect(page).to have_field('Gender', with: marge.gender)
        has_react_select_field('Language(s) (Primary First)', with: marge.languages)
        # Date of birth should not have datepicker, but limiting by field ID will break when
        # DOB fields are correctly namespaced by participant ID. Feel free to make this more
        # specific once that's done.
        expect(page).not_to have_selector('.rw-select')
        dob = Time.parse(marge.date_of_birth).strftime('%m/%d/%Y')
        expect(page).to have_field('Date of birth', with: dob)
        expect(page).to have_field('Address', with: marge.addresses.first.street_address)
        expect(page).to have_field('City', with: marge.addresses.first.city)
        expect(page).to have_field('State', with: marge.addresses.first.state)
        expect(page).to have_field('Zip', with: marge.addresses.first.zip)
        expect(page).to have_field('Address Type', with: marge.addresses.first.type)
        within '#ethnicity' do
          expect(page.find('input[value="Yes"]')).to be_checked
          expect(page).to have_field("participant-#{marge.id}-ethnicity-detail", text: 'Mexican')
        end
        within '#race' do
          expect(page.find('input[value="Asian"]')).to be_checked
          expect(page).to have_field("participant-#{marge.id}-Asian-race-detail", text: 'Hmong')
        end
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
        fill_in 'Social security number', with: new_ssn
        fill_in 'City', with: 'New City'
      end

      marge.ssn = new_ssn
      marge.addresses.first.city = 'New City'

      stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
    end

    within edit_participant_card_selector(homer.id) do
      within '.card-body' do
        fill_in 'First Name', with: 'My new first name'
      end
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_content(new_ssn)
        expect(page).to_not have_content(old_ssn)
        expect(page).to have_selector("#address-#{marge.addresses.first.id}")
        expect(page).to have_content('New City')
        expect(page).to_not have_content('Springfield')
      end
    end

    within edit_participant_card_selector(homer.id) do
      within '.card-body' do
        expect(page).to have_field('First Name', with: 'My new first name')
      end
    end
  end

  context 'editing social security number (ssn)' do
    scenario 'numbers are formatted correctly' do
      visit edit_screening_path(id: screening.id)
      within edit_participant_card_selector(homer.id) do
        within '.card-body' do
          fill_in 'Social security number', with: ''
          expect(page).to have_field('Social security number', with: '')
          fill_in 'Social security number', with: 1
          expect(page).to have_field('Social security number', with: '1__-__-____')
          fill_in 'Social security number', with: 123_456_789
          expect(page).to have_field('Social security number', with: '123-45-6789')
        end
      end
    end

    scenario 'an invalid character is inserted' do
      visit edit_screening_path(id: screening.id)
      within edit_participant_card_selector(homer.id) do
        within '.card-body' do
          fill_in 'Social security number', with: '12k34?!#adf567890'
          expect(page).to have_field('Social security number', with: '123-45-6789')
        end
      end
    end
  end

  scenario 'editing and then removing an address from a participant',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector("#address-#{marge.addresses.first.id}")
        expect(page).to have_field('Address', with: marge.addresses.first.street_address)
        expect(page).to have_field('City', with: marge.addresses.first.city)
        expect(page).to have_field('State', with: marge.addresses.first.state)
        expect(page).to have_field('Zip', with: marge.addresses.first.zip)
        expect(page).to have_field('Address Type', with: marge.addresses.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
        fill_in 'City', with: 'New City'
      end

      marge.addresses.first.city = 'New City'

      stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector("#address-#{marge.addresses.first.id}")
        expect(page).to have_content('New City')
        expect(page).to_not have_content('Springfield')
      end

      within '.card-header' do
        click_link 'Edit person'
      end
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        within "#address-#{marge.addresses.first.id}" do
          click_link 'Delete address'
        end

        expect(page).to_not have_selector("#address-#{marge.addresses.first.id}")
      end
    end

    marge.addresses = []

    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(body: as_json_without_root_id(marge))
      .and_return(json_body(marge.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end
  end

  scenario 'when a user modifies languages for an existing participant',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within('.col-md-12', text: 'Language(s)') do
        fill_in_react_select 'Language(s)', with: 'English'
        fill_in_react_select 'Language(s)', with: 'Farsi'
        remove_react_select_option('Language(s)', marge.languages.first)
        fill_in_react_select 'Language(s)', with: 'Arabic'
        fill_in_react_select 'Language(s)', with: 'Spanish'
      end
      marge.languages = %w[English Arabic]
      stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(body: marge.to_json)
        .and_return(json_body(marge.to_json, status: 200))
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .and_return(json_body(marge.to_json, status: 200))

      click_button 'Save'
      expect(a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge)))).to have_been_made
    end
  end

  scenario 'when a user tabs out of the language multi-select',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within('.col-md-12', text: 'Language(s)') do
        fill_in_react_select 'Language(s)', with: 'English', exit_key: :tab
        has_react_select_field 'Language(s)', with: ['Russian']
      end
    end
  end

  scenario 'canceling edits for a screening participant' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_field('Social security number', with: old_ssn)
        fill_in 'Social security number', with: new_ssn
        expect(page).to have_field('Social security number', with: new_ssn)
        click_button 'Cancel'
      end
    end

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
    ).to_not have_been_made

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_content(old_ssn)
        expect(page).to_not have_content(new_ssn)
      end
    end
  end

  scenario 'when a user clicks cancel on edit page' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      fill_in 'Social security number', with: new_ssn
      click_button 'Cancel'
    end

    expect(page).to have_content marge_formatted_name
    expect(page).to have_link 'Edit person'
    expect(page).to have_content old_ssn
  end

  scenario 'when a user edits a participants role in a screening' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      has_react_select_field('Role', with: %w[Victim Perpetrator])
      remove_react_select_option('Role', 'Perpetrator')
      expect(page).to have_no_content('Perpetrator')

      stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .and_return(json_body(marge.to_json, status: 200))

      within '.card-body' do
        click_button 'Save'
      end
    end

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(body: hash_including('roles' => ['Victim']))
    ).to have_been_made

    expect(page).to have_selector(show_participant_card_selector(marge.id))
  end

  scenario 'when a user tabs out of the role multi-select' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select 'Role', with: 'Family Member', exit_key: :tab
      has_react_select_field 'Role', with: %w[Victim Perpetrator]
    end
  end

  context 'A participant has an existing reporter role' do
    let(:marge_roles) { ['Mandated Reporter'] }

    scenario 'the other reporter roles are unavailable' do
      visit edit_screening_path(id: screening.id)

      within edit_participant_card_selector(marge.id) do
        fill_in_react_select('Role', with: 'Non-mandated Reporter')
        has_react_select_field('Role', with: ['Mandated Reporter'])

        remove_react_select_option('Role', 'Mandated Reporter')
        fill_in_react_select('Role', with: 'Non-mandated Reporter')
        has_react_select_field('Role', with: ['Non-mandated Reporter'])
      end
    end
  end

  scenario 'when a user modifies existing person ethnicity to null',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within('#ethnicity') do
        find('label', text: 'Yes').click
      end
      marge.ethnicity = { hispanic_latino_origin: nil, ethnicity_detail: nil }

      stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .and_return(json_body(marge.to_json, status: 200))

      click_button 'Save'
      expect(a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge))))
        .to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      expect(page).to_not have_content('Yes - Mexican')
    end
  end

  scenario 'setting an approximate age',
    pending: 'until person card refactor complete' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(marge.id) do
      expect(page).to have_field('Approximate Age', disabled: true)
      expect(page).to have_field('approximate_age_units', disabled: true)

      fill_in_datepicker 'Date of birth', with: ''
      expect(page).to have_field('Approximate Age', disabled: false)
      expect(page).to have_field('approximate_age_units', disabled: false)

      fill_in 'Approximate Age', with: 'abc1234'
      select 'Days', from: 'approximate_age_units'
      expect(page).to have_field('Approximate Age', with: '123')
      expect(page).to have_select('approximate_age_units', selected: 'Days')

      dob = Time.parse(marge.date_of_birth).strftime('%m/%d/%Y')
      fill_in_datepicker 'Date of birth', with: dob
      expect(page).to have_field('Approximate Age', disabled: true, with: '')
      expect(page).to have_select('approximate_age_units', disabled: true, selected: 'Years')

      fill_in_datepicker 'Date of birth', with: ''
      fill_in 'Approximate Age', with: 'abc1234'
      select 'Days', from: 'approximate_age_units'
      fill_in_datepicker 'Date of birth', with: dob, blur: false
      click_button 'Save'
      expect(a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge))))
        .to have_been_made
    end
  end
end
