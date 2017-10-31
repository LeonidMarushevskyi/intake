# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'edit allegations' do
  scenario 'loading screening with participants generates possible allegations' do
    marge = FactoryGirl.create(
      :participant,
      :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil
    )
    homer = FactoryGirl.create(
      :participant,
      :perpetrator,
      first_name: 'Homer',
      last_name: 'Simpson',
      date_of_birth: nil
    )
    bart = FactoryGirl.create(
      :participant,
      first_name: 'Bart',
      last_name: 'Simpson',
      date_of_birth: nil,
      roles: %w[Victim Perpetrator]
    )
    lisa = FactoryGirl.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: nil)
    screening = FactoryGirl.create(:screening, participants: [marge, homer, bart, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within('tbody') do
        table_rows = page.all('tr')
        expect(table_rows.count).to eq(5)

        within(table_rows[0]) do
          expect(page).to have_content('Bart')
          expect(page).to have_content('Homer')
          has_react_select_field("allegations_#{bart.id}_#{homer.id}", with: [])
        end

        within(table_rows[1]) do
          expect(page).to have_no_content('Bart')
          expect(page).to have_content('Marge')
          has_react_select_field("allegations_#{bart.id}_#{marge.id}", with: [])
        end

        within(table_rows[2]) do
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Bart')
          has_react_select_field("allegations_#{lisa.id}_#{bart.id}", with: [])
        end

        within(table_rows[3]) do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Homer')
          has_react_select_field("allegations_#{lisa.id}_#{homer.id}", with: [])
        end

        within(table_rows[4]) do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Marge')
          has_react_select_field("allegations_#{lisa.id}_#{marge.id}", with: [])
        end
      end
    end
  end

  scenario 'removing participant role, re-adding it does not show deleted allegations' do
    marge = FactoryGirl.create(
      :participant,
      first_name: 'Marge',
      roles: ['Perpetrator', 'Anonymous Reporter']
    )
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa', last_name: 'Simpson')
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, lisa]
    )
    allegation = FactoryGirl.create(
      :allegation,
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id
    )
    screening.allegations << allegation
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
      end
      click_button 'Cancel'
    end

    marge.roles = ['Anonymous Reporter']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(json_body(as_json_without_root_id(marge)))
      .and_return(json_body(marge.to_json, status: 200))

    screening.allegations = []
    screening.participants = [lisa, marge]
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      remove_react_select_option('Role', 'Perpetrator')
      click_button 'Save'
    end

    within '.card.show', text: 'Allegations' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
      end
    end

    within show_participant_card_selector(marge.id) do
      click_link 'Edit person'
    end

    marge.roles = ['Anonymous Reporter', 'Perpetrator']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(json_body(as_json_without_root_id(marge)))
      .and_return(json_body(marge.to_json, status: 200))

    screening.participants = [lisa, marge]
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select('Role', with: 'Perpetrator')
      click_button 'Save'
    end

    within '.card.show', text: 'Allegations' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
      end

      click_link 'Edit allegations'
    end

    within '#allegations-card.card.edit' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
      end
    end
  end

  scenario 'changing the roles of participants creates new possible allegation rows' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'thead' do
        expect(page).to have_content('Alleged Victim/Children')
        expect(page).to have_content('Alleged Perpetrator')
        expect(page).to have_content('Allegation(s)')
      end

      expect(page).to have_no_selector('td')
    end

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select('Role', with: 'Perpetrator')
      marge.roles = ['Perpetrator']
      stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_no_selector('td')
    end

    lisa.roles = ['Victim']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(lisa.id)))
      .with(body: as_json_without_root_id(lisa))
      .and_return(json_body(lisa.to_json, status: 200))

    screening.participants = [marge, lisa]
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    within edit_participant_card_selector(lisa.id) do
      fill_in_react_select('Role', with: 'Victim')
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      within('tbody tr') do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
      end
    end
  end

  scenario 'deleting a participant removes possible allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within('tbody tr') do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
      end
    end

    screening.participants = [lisa]
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      stub_request(:delete, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .and_return(json_body(nil, status: 204))

      click_button 'Delete person'
    end

    within '#allegations-card.card.edit' do
      within('table') do
        expect(page).to have_no_content('Lisa')
        expect(page).to have_no_content('Marge')
      end
    end
  end

  scenario 'edit and saving allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    allegation_attributes = {
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id,
      allegation_types: ['General neglect']
    }

    screening_with_new_allegation = screening.dup.tap do |obj|
      obj.assign_attributes(
        allegations: [FactoryGirl.build(:allegation, allegation_attributes)]
      )
    end

    persisted_allegation = FactoryGirl.create(:allegation, allegation_attributes)
    screening.assign_attributes(allegations: [persisted_allegation])

    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within '#allegations-card.card.edit' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}",
        with: 'Severe neglect', exit_key: :tab
      has_react_select_field "allegations_#{lisa.id}_#{marge.id}", with: ['General neglect']
      click_button 'Save'
    end

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(body: as_json_without_root_id(
        screening_with_new_allegation
      ).merge('participants' => []))
    ).to have_been_made

    within '.card.show', text: 'Allegations' do
      within 'table tbody tr' do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
        expect(page).to have_content('General neglect')
      end
    end
  end

  scenario 'cancel edits for new allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
      click_button 'Cancel'
    end

    within '.card.show', text: 'Allegations' do
      within('table') do
        expect(page).to have_no_content('Lisa')
        expect(page).to have_no_content('Marge')
        expect(page).to have_no_content('General neglect')
      end
    end
  end

  scenario 'cancel edits for a persisted allegation' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])

    allegation = FactoryGirl.create(
      :allegation,
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id,
      allegation_types: ['General neglect']
    )
    screening.allegations << allegation

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'Severe neglect'
      page.find('.card-header').click
      click_button 'Cancel'
    end

    within '.card.show', text: 'Allegations' do
      within('table') do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
        expect(page).to have_content('General neglect')
        expect(page).to_not have_content('Severe neglect')
      end
    end
  end

  scenario 'editing allegation types will not impact other allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil)
    homer = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simpson',
      date_of_birth: nil)
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa', last_name: 'Simps')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa, homer])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'tbody' do
        table_rows = page.all('tr')

        within(table_rows[0]) do
          fill_in_react_select "allegations_#{lisa.id}_#{homer.id}", with: 'General neglect'
          has_react_select_field "allegations_#{lisa.id}_#{homer.id}", with: ['General neglect']
        end

        within(table_rows[1]) do
          has_react_select_field "allegations_#{lisa.id}_#{marge.id}", with: []
        end
      end
    end
  end

  scenario 'I remove a participant for whom I have added allegation types' do
    marge = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil)
    homer = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simpson',
      date_of_birth: nil)
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa', last_name: 'Simps')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa, homer])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'tbody' do
        table_rows = page.all('tr')
        within(table_rows[0]) do
          has_react_select_field "allegations_#{lisa.id}_#{homer.id}", with: []
        end

        within(table_rows[1]) do
          fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
          has_react_select_field "allegations_#{lisa.id}_#{marge.id}", with: ['General neglect']
        end
      end
    end

    within edit_participant_card_selector(marge.id) do
      stub_request(:delete, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .and_return(json_body(nil, status: 204))

      click_button 'Delete person'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_content('Lisa')
      expect(page).to have_content('Homer')
      expect(page).to_not have_content('Marge')
      expect(page).to_not have_content('General neglect')
    end
  end

  scenario 'I remove the victim role from a participant for whom I have edited allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge', last_name: 'Simps')
    lisa = FactoryGirl.create(
      :participant,
      roles: ['Victim', 'Anonymous Reporter'],
      first_name: 'Lisa',
      last_name: 'Simps'
    )
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)
    allegation_attributes = {
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id,
      allegation_types: ['General neglect']
    }

    screening_with_new_allegation = screening.dup.tap do |obj|
      obj.assign_attributes(
        allegations: [FactoryGirl.build(:allegation, allegation_attributes)]
      )
    end

    persisted_allegation = FactoryGirl.create(:allegation, allegation_attributes)
    screening.assign_attributes(allegations: [persisted_allegation])

    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(body: as_json_without_root_id(
        screening_with_new_allegation
      ).merge('participants' => []))
      .and_return(json_body(screening.to_json, status: 200))

    within '#allegations-card.card.edit' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
      click_button 'Save'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_content('Lisa')
      expect(page).to have_content('Marge')
      expect(page).to have_content('General neglect')
    end

    lisa.roles = ['Anonymous Reporter']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(lisa.id)))
      .with(json_body(as_json_without_root_id(lisa)))
      .and_return(json_body(lisa.to_json, status: 200))

    screening.assign_attributes(allegations: [])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(lisa.id) do
      remove_react_select_option('Role', 'Victim')
      click_button 'Save'
    end

    within show_participant_card_selector(lisa.id) do
      click_link 'Edit person'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_no_content('Lisa')
      expect(page).to have_no_content('Marge')
      expect(page).to have_no_content('General neglect')
      click_link 'Edit allegations'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_no_content('Lisa')
      expect(page).to have_no_content('Marge')
      expect(page).to have_no_content('General neglect')
    end

    lisa.roles = ['Anonymous Reporter', 'Victim']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(lisa.id)))
      .with(json_body(as_json_without_root_id(lisa)))
      .and_return(json_body(lisa.to_json, status: 200))
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(lisa.id) do
      fill_in_react_select('Role', with: 'Victim')
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_content('Lisa')
      expect(page).to have_content('Marge')
      expect(page).to have_no_content('General neglect')
    end
  end

  scenario 'I remove the perpetrator role from a participant for whom I have edited allegations' do
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa', last_name: 'Simps')
    marge = FactoryGirl.create(
      :participant,
      roles: ['Perpetrator', 'Anonymous Reporter'],
      first_name: 'Marge',
      last_name: 'Simps'
    )
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)
    allegation_attributes = {
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id,
      allegation_types: ['General neglect']
    }

    screening_with_new_allegation = screening.dup.tap do |obj|
      obj.assign_attributes(
        allegations: [FactoryGirl.build(:allegation, allegation_attributes)]
      )
    end

    persisted_allegation = FactoryGirl.create(:allegation, allegation_attributes)
    screening.assign_attributes(allegations: [persisted_allegation])

    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(body: as_json_without_root_id(
        screening_with_new_allegation
      ).merge('participants' => []))
      .and_return(json_body(screening.to_json, status: 200))

    within '#allegations-card.card.edit' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
      click_button 'Save'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_content('Lisa')
      expect(page).to have_content('Marge')
      expect(page).to have_content('General neglect')
    end

    marge.roles = ['Anonymous Reporter']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(json_body(as_json_without_root_id(marge)))
      .and_return(json_body(marge.to_json, status: 200))

    screening.assign_attributes(allegations: [])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      remove_react_select_option('Role', 'Perpetrator')
      click_button 'Save'
    end

    within show_participant_card_selector(marge.id) do
      click_link 'Edit person'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_no_content('Lisa')
      expect(page).to have_no_content('Marge')
      expect(page).to have_no_content('General neglect')
      click_link 'Edit allegations'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_no_content('Lisa')
      expect(page).to have_no_content('Marge')
      expect(page).to have_no_content('General neglect')
    end

    marge.roles = ['Anonymous Reporter', 'Perpetrator']
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(json_body(as_json_without_root_id(marge)))
      .and_return(json_body(marge.to_json, status: 200))
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select('Role', with: 'Perpetrator')
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_content('Lisa')
      expect(page).to have_content('Marge')
      expect(page).to have_no_content('General neglect')
    end
  end

  scenario 'saving another card will not persist changes to allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
    end

    screening.name = 'Hello'
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within '#screening-information-card.card.edit' do
      fill_in 'Title/Name of Screening', with: 'Hello'
      click_button 'Save'
    end

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening).merge('participants' => [])))
    ).to have_been_made
  end

  scenario 'only allegations with allegation types are sent to the API' do
    marge = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil)
    homer = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simpson',
      date_of_birth: nil)
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa', last_name: 'Simps')
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, homer, lisa]
    )

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'tbody' do
        table_rows = page.all('tr')

        within table_rows[0] do
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Homer')

          select_field_id = "allegations_#{lisa.id}_#{homer.id}"
          has_react_select_field(select_field_id, with: [])
          fill_in_react_select(select_field_id, with: 'Exploitation')
        end

        within table_rows[1] do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Marge')
          has_react_select_field("allegations_#{lisa.id}_#{marge.id}", with: [])
        end
      end
      click_button 'Save'
    end

    new_allegation = FactoryGirl.build(
      :allegation,
      victim_id: lisa.id,
      perpetrator_id: homer.id,
      screening_id: screening.id,
      allegation_types: ['Exploitation']
    )
    screening.allegations << new_allegation

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening).merge('participants' => [])))
    ).to have_been_made
  end
end
