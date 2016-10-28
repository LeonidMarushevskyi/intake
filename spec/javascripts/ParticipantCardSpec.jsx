import Immutable from 'immutable'
import ParticipantCard from 'ParticipantCard'
import React from 'react'
import {mount} from 'enzyme'

describe('ParticipantCard', () => {
  describe('when mode is set to show', () => {
    let wrapper
    beforeEach(() => {
      const participant = Immutable.fromJS({id: 5, first_name: 'Tony', last_name: 'Hawk'})
      wrapper = mount(<ParticipantCard participant={participant} mode='show'/>)
    })

    it('renders the participants show view for each participant', () => {
      expect(wrapper.find('ParticipantShowView').length).toEqual(1)
    })

    describe("when a user clicks 'Edit participant'", () => {
      beforeEach(() => {
        const editLink = wrapper.find('a[aria-label="Edit participant"]')
        editLink.simulate('click')
      })

      it('the participants edit view is rendered for that participant', () => {
        expect(wrapper.find('ParticipantEditView').length).toEqual(1)
      })
    })
  })

  describe('when mode is set to edit', () => {
    let wrapper
    beforeEach(() => {
      const participant = Immutable.fromJS({id: 5, first_name: 'Tony', last_name: 'Hawk'})
      wrapper = mount(<ParticipantCard participant={participant} mode='edit'/>)
    })

    it('renders the participants edit view for each participant', () => {
      expect(wrapper.find('ParticipantEditView').length).toEqual(1)
    })
  })
})
