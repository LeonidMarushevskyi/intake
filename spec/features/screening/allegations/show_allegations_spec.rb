# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'show allegations' do
  scenario 'editing existing allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: nil)
    lisa = FactoryGirl.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simpsson',
      date_of_birth: nil)
    homer = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simps',
      date_of_birth: nil)
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, homer, lisa]
    )
    allegation = FactoryGirl.create(
      :allegation,
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id,
      allegation_types: ['General neglect', 'Severe neglect']
    )
    screening.allegations << allegation

    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    visit screening_path(id: screening.id)

    within '.card.show', text: 'Allegations' do
      within 'thead' do
        expect(page).to have_content('Alleged Victim/Children')
        expect(page).to have_content('Alleged Perpetrator')
        expect(page).to have_content('Allegation(s)')
      end

      within 'tbody' do
        expect(page).to_not have_content('Homer')

        table_rows = page.all('tr')

        within table_rows[0] do
          expect(page).to have_content('Marge')
          expect(page).to have_content('Lisa')
          expect(page).to have_content('General neglect')
        end

        within table_rows[1] do
          expect(page).to have_content('Marge')
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Severe neglect')
        end
      end
      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
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
          has_react_select_field(
            "allegations_#{lisa.id}_#{marge.id}",
            with: ['General neglect', 'Severe neglect']
          )
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
    screening.allegations.push(new_allegation)

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening).merge('participants' => [])))
    ).to have_been_made
  end

  scenario 'deleting a participant from a screening removes related allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Marge',
      last_name: 'Simpson')
    lisa = FactoryGirl.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simpson')
    homer = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simpson')
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, homer, lisa]
    )
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
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening.id)

    within '.card.show', text: 'Allegations' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to have_content('General neglect')
      end
    end

    stub_request(:delete, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .and_return(json_body(nil, status: 204))

    screening.allegations = []
    screening.participants = [lisa, homer]
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within show_participant_card_selector(marge.id) do
      click_button 'Delete person'
    end

    within '.card.show', text: 'Allegations' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
        expect(page).to_not have_content('General neglect')
      end

      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      within 'tbody' do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Homer')
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('General neglect')
      end
    end
  end

  scenario 'removing participant role, re-adding it does not show deleted allegations' do
    marge = FactoryGirl.create(
      :participant,
      first_name: 'Marge',
      roles: ['Perpetrator', 'Anonymous Reporter']
    )
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, lisa]
    )
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
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening.id)

    within '.card.show', text: 'Allegations' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to have_content('General neglect')
      end
    end

    within show_participant_card_selector(marge.id) do
      click_link 'Edit person'
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
        expect(page).to_not have_content('General neglect')
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
        expect(page).to_not have_content('General neglect')
      end

      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        has_react_select_field "allegations_#{lisa.id}_#{marge.id}", with: []
      end
    end
  end

  scenario 'saving another card will not persist changes to allegations' do
    marge = FactoryGirl.create(:participant, :perpetrator, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, :victim, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening.id)

    screening.name = 'Hello'
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))

    within '.card.show', text: 'Allegations' do
      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
      fill_in_react_select "allegations_#{lisa.id}_#{marge.id}", with: 'General neglect'
    end

    within '#screening-information-card.card.show' do
      click_link 'Edit screening information'
    end

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
      last_name: 'Simps',
      date_of_birth: nil)
    lisa = FactoryGirl.create(:participant, :victim,
      first_name: 'Lisa',
      last_name: 'Simps',
      date_of_birth: nil)
    homer = FactoryGirl.create(:participant, :perpetrator,
      first_name: 'Homer',
      last_name: 'Simps',
      date_of_birth: nil)
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, homer, lisa]
    )

    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening.id)

    within '.card.show', text: 'Allegations' do
      click_link 'Edit allegations'
    end

    within '.card.edit', text: 'Allegations' do
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
