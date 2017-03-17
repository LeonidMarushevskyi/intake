import Immutable from 'immutable'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import {mount} from 'enzyme'

describe('ParticipantCardView', () => {
  describe('when mode is set to show', () => {
    let component
    beforeEach(() => {
      const participant = Immutable.fromJS({id: '5', first_name: 'Tony', last_name: 'Hawk'})
      component = mount(<ParticipantCardView participant={participant} mode='show'/>)
    })

    it('renders the participants show view for each participant', () => {
      expect(component.find('ParticipantShowView').length).toEqual(1)
    })

    it('changes the mode when onEdit is called', () => {
      component.instance().onEdit()
      expect(component.instance().state.mode).toEqual('edit')
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
    const participantIndex = 2
    const onCancel = jasmine.createSpy('onCancel')
    const onChange = jasmine.createSpy('onCancel')
    const onSave = jasmine.createSpy('onCancel')
    const participantId = '5'
    const participant = Immutable.fromJS({id: participantId, first_name: 'Tony', last_name: 'Hawk', ssn: 'ssn-1'})

    beforeEach(() => {
      component = mount(
        <ParticipantCardView
          participant={participant}
          mode='edit'
          onCancel={onCancel}
          onChange={onChange}
          onSave={onSave}
          index={participantIndex}
        />
      )
    })

    it('renders the participants edit view for each participant', () => {
      expect(component.find('ParticipantEditView').length).toEqual(1)
    })

    it("on edit when user hits 'Cancel' renders show view ", () => {
      const cancelButton = component.find('button[children="Cancel"]')
      cancelButton.simulate('click')
      expect(onCancel).toHaveBeenCalledWith(participantId)
      expect(component.find('ParticipantShowView').length).toEqual(1)
    })

    it('calls onCancel from props and changes mode to show when onCancel is called', () => {
      component.instance().onCancel()
      expect(onCancel).toHaveBeenCalled()
      expect(component.instance().state.mode).toEqual('show')
    })

    it('calls onSave from props and changes the mode to show when onSave is called', () => {
      component.instance().onSave()
      expect(onSave).toHaveBeenCalled()
      expect(component.instance().state.mode).toEqual('show')
    })

    it('calls onChange from props with the appropriately changed values when onChange is called', () => {
      const updatedParticipant = participant.setIn(['first_name'], 'Bart')
      component.instance().onChange(['first_name'], 'Bart')
      expect(onChange).toHaveBeenCalledWith(participantId, updatedParticipant)
    })
  })
})
