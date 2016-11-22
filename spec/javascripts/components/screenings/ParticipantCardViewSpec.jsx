import Immutable from 'immutable'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import {mount} from 'enzyme'

describe('ParticipantCardView', () => {
  describe('when mode is set to show', () => {
    let component
    beforeEach(() => {
      const participant = Immutable.fromJS({id: 5, first_name: 'Tony', last_name: 'Hawk'})
      component = mount(<ParticipantCardView participant={participant} mode='show'/>)
    })

    it('renders the participants show view for each participant', () => {
      expect(component.find('ParticipantShowView').length).toEqual(1)
    })

    describe("when a user clicks 'Edit participant'", () => {
      beforeEach(() => {
        const editLink = component.find('a[aria-label="Edit participant"]')
        editLink.simulate('click')
      })

      it('the participants edit view is rendered for that participant', () => {
        expect(component.find('ParticipantEditView').length).toEqual(1)
      })
    })
  })

  describe('when mode is set to edit', () => {
    let component
    beforeEach(() => {
      const participant = Immutable.fromJS({id: 5, first_name: 'Tony', last_name: 'Hawk'})
      component = mount(<ParticipantCardView participant={participant} mode='edit'/>)
    })

    it('renders the participants edit view for each participant', () => {
      expect(component.find('ParticipantEditView').length).toEqual(1)
    })
  })
})
