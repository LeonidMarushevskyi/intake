# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Screening Decision Validations' do
  let(:error_message) { 'Please enter at least one allegation to promote to referral.' }
  let(:perpetrator) { FactoryGirl.create(:participant, :perpetrator) }
  let(:victim) { FactoryGirl.create(:participant, :victim) }
  let(:screening) do
    FactoryGirl.create(
      :screening,
      participants: [perpetrator, victim],
      screening_decision: screening_decision
    )
  end

  before do
    allegation = FactoryGirl.create(
      :allegation,
      victim_id: victim.id,
      perpetrator_id: perpetrator.id,
      screening_id: screening.id
    )
    screening.allegations << allegation
  end

  context 'When page is opened in edit mode' do
    before do
      stub_and_visit_edit_screening(screening)
    end

    context 'Screening decision is set to nil on page load' do
      let(:screening_decision) { nil }

      scenario 'Selecting promote to referral decision requires allegations' do
        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
          click_button 'Cancel'
        end

        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
          click_link 'Edit'
        end

        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: { screening_decision: 'promote_to_referral' }
        )

        within '#decision-card.edit' do
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
          click_button 'Save'
        end

        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end
      end

      scenario 'Clearing promote to referral decision removes error message' do
        within '#decision-card.edit' do
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
          select 'Screen out', from: 'Screening Decision'
          blur_field
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'Adding and removing allegations shows or hides error message' do
        within '#decision-card.edit' do
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
        end

        within '#allegations-card.edit' do
          fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'General neglect'
        end

        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
        end

        within '#allegations-card.edit' do
          remove_react_select_option "allegations_#{victim.id}_#{perpetrator.id}", 'General neglect'
        end

        within '#decision-card.edit' do
          expect(page).to have_content(error_message)
        end
      end
    end

    context 'Screening decision is already set to promote to referral' do
      let(:screening_decision) { 'promote_to_referral' }

      scenario 'Error message doesn not display until user has interacted with the field' do
        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
        end
      end
    end
  end

  context 'When page is opened in show view' do
    before do
      stub_and_visit_show_screening(screening)
    end

    context 'Screening decision is set to nil on page load' do
      let(:screening_decision) { nil }

      scenario 'User does not see error messages on page load' do
        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
        end
      end
    end

    context 'Screening decision is already set to promote to referral' do
      let(:screening_decision) { 'promote_to_referral' }

      scenario 'User sees error messages on page load' do
        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end
      end

      scenario 'Adding and removing allegations shows or hides error message' do
        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end

        within '#allegations-card.show' do
          click_link 'Edit'
        end

        within '#allegations-card.edit' do
          fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'General neglect'
        end

        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
        end

        within '#allegations-card.edit' do
          remove_react_select_option "allegations_#{victim.id}_#{perpetrator.id}", 'General neglect'
        end

        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end
      end
    end
  end
end
