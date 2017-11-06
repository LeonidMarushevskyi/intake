# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Allegations Sibling At Risk Validations' do
  let(:sibling_at_risk_error) do
    'Any allegations of Sibling at Risk must be accompanied by another allegation.'
  end
  let(:perpetrator) { FactoryGirl.create(:participant, :perpetrator) }
  let(:perpetrator2) { FactoryGirl.create(:participant, :perpetrator) }
  let(:victim) { FactoryGirl.create(:participant, :victim) }
  let(:victim2) { FactoryGirl.create(:participant, :victim) }
  let(:screening) do
    FactoryGirl.create(
      :screening,
      participants: [perpetrator, perpetrator2, victim, victim2]
    )
  end

  context 'when allegations have no types' do
    let(:allegations) do
      [
        FactoryGirl.create(
          :allegation,
          victim_id: victim.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id
        ),
        FactoryGirl.create(
          :allegation,
          victim_id: victim2.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id
        )
      ]
    end

    before do
      screening.allegations = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees no sibling error' do
      within '.card.edit', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
        click_link 'Edit'
      end
    end

    scenario 'User sees error when adding at risk allegation' do
      within '.card.edit', text: 'Allegations' do
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}",
          with: 'At risk, sibling abused'
        expect(page).to have_content(sibling_at_risk_error)
        allegations.first.allegation_types = ['At risk, sibling abused']
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations
          }
        )

        blur_field # "allegations_#{victim.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_link 'Edit'
      end
    end

    scenario 'User can make the error go away' do
      within '.card.edit', text: 'Allegations' do
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}",
          with: 'At risk, sibling abused'
        expect(page).to have_content(sibling_at_risk_error)

        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}",
          with: 'General neglect'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first.allegation_types = ['At risk, sibling abused']
        allegations.second.allegation_types = ['General neglect']
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when allegations have only sibling at risk' do
    let(:allegations) do
      [
        FactoryGirl.create(
          :allegation,
          victim_id: victim.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['At risk, sibling abused']
        ),
        FactoryGirl.create(
          :allegation,
          victim_id: victim2.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['At risk, sibling abused']
        )
      ]
    end

    before do
      screening.allegations = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees warning about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_link 'Edit'
      end
    end

    scenario 'User can fix warning about at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'Physical abuse'
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}", with: 'General neglect'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first.allegation_types = ['At risk, sibling abused', 'Physical abuse']
        allegations.second.allegation_types = ['At risk, sibling abused', 'General neglect']
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when some have sibling at risk and other with abuse' do
    let(:allegations) do
      [
        FactoryGirl.create(
          :allegation,
          victim_id: victim.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['At risk, sibling abused']
        ),
        FactoryGirl.create(
          :allegation,
          victim_id: victim2.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['Physical abuse']
        )
      ]
    end

    before do
      screening.allegations = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees no warning about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when one victim has multiple allegations against a perp and is at risk' do
    let(:allegations) do
      [
        FactoryGirl.create(
          :allegation,
          victim_id: victim.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['At risk, sibling abused', 'General neglect']
        )
      ]
    end

    before do
      screening.allegations = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees error about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
      end
    end

    scenario 'User can fix error' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'Exploitation'
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}", with: 'Physical abuse'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first.allegation_types = [
          'At risk, sibling abused', 'General neglect', 'Exploitation'
        ]
        allegations << FactoryGirl.build(
          :allegation,
          victim_id: victim2.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['Physical abuse']
        )
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end

  context 'when two allegations against two perps for one victim who is marked at risk' do
    let(:allegations) do
      [
        FactoryGirl.create(
          :allegation,
          victim_id: victim.id,
          perpetrator_id: perpetrator.id,
          screening_id: screening.id,
          allegation_types: ['At risk, sibling abused', 'General neglect']
        ),
        FactoryGirl.create(
          :allegation,
          victim_id: victim.id,
          perpetrator_id: perpetrator2.id,
          screening_id: screening.id,
          allegation_types: ['Exploitation']
        )
      ]
    end

    before do
      screening.allegations = allegations
      stub_and_visit_edit_screening(screening)
    end

    scenario 'User sees error about sibling at risk' do
      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        click_button 'Cancel'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
      end
    end

    scenario 'User can fix error' do
      new_allegation = FactoryGirl.create(
        :allegation,
        victim_id: victim2.id,
        perpetrator_id: perpetrator.id,
        screening_id: screening.id,
        allegation_types: ['Physical abuse']
      )

      within '.card.edit', text: 'Allegations' do
        expect(page).to have_content(sibling_at_risk_error)
        fill_in_react_select "allegations_#{victim2.id}_#{perpetrator.id}", with: 'Physical abuse'
        expect(page).not_to have_content(sibling_at_risk_error)
        allegations.first.allegation_types = ['At risk, sibling abused', 'General neglect']
        allegations.second.allegation_types = ['Exploitation', 'Physical abuse']
        allegations << new_allegation
        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: {
            allegations: allegations
          }
        )

        blur_field # "allegations_#{victim2.id}_#{perpetrator.id}"

        click_button 'Save'
      end

      within '.card.show', text: 'Allegations' do
        expect(page).not_to have_content(sibling_at_risk_error)
      end
    end
  end
end
