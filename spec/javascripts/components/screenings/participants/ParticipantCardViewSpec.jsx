import Immutable from 'immutable'
import ParticipantCardView from 'screenings/ParticipantCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantCardView', () => {
  describe('#onEdit', () => {
    it('toggles the mode to edit', () => {
      const component = shallow(<ParticipantCardView participant={Immutable.Map()} mode={'show'}/>)
      const instance = component.instance()
      const event = jasmine.createSpyObj('event', ['preventDefault'])
      instance.onEdit(event)
      expect(instance.state.mode).toEqual('edit')
      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  describe('#onCancel', () => {
    let instance
    let onCancel
    const participant = Immutable.fromJS({id: '123'})
    beforeEach(() => {
      onCancel = jasmine.createSpy('onCancel')
      const component = shallow(<ParticipantCardView {...{participant, onCancel, mode: 'edit'}} />)
      instance = component.instance()
      instance.onCancel()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('calls onCancel from props with participant id', () => {
      expect(onCancel).toHaveBeenCalledWith(participant.get('id'))
    })
  })

  describe('#onSave', () => {
    let instance
    let onSave
    const participant = Immutable.fromJS({id: '123'})
    beforeEach(() => {
      onSave = jasmine.createSpy('onSave')
      const component = shallow(<ParticipantCardView {...{participant, onSave, mode: 'edit'}} />)
      instance = component.instance()
      instance.onSave()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('calls onSave from props with participant', () => {
      expect(onSave).toHaveBeenCalledWith(participant)
    })
  })

  describe('when mode is set to show', () => {
    let component

    beforeEach(() => {
      const participant = Immutable.fromJS({id: '5', first_name: 'Tony', last_name: 'Hawk', roles: []})
      component = shallow(<ParticipantCardView participant={participant} mode='show'/>)
    })

    it('renders the participants show view', () => {
      expect(component.find('ParticipantShowView').length).toEqual(1)
    })

    describe('and onEdit is called on ParticipantShowView', () => {
      beforeEach(() => {
        const event = jasmine.createSpyObj('event', ['preventDefault'])
        component.find('ParticipantShowView').props().onEdit(event)
      })

      it('the participants edit view is rendered', () => {
        expect(component.find('ParticipantEditView').length).toEqual(1)
      })
    })
  })

  describe('when mode is set to edit', () => {
    let component
    const onCancel = jasmine.createSpy('onCancel')
    const onChange = jasmine.createSpy('onCancel')
    const onSave = jasmine.createSpy('onCancel')
    const participantId = '5'
    const participant = Immutable.fromJS({
      id: participantId,
      first_name: 'Tony',
      last_name: 'Hawk',
      ssn: 'ssn-1',
      roles: [],
      phone_numbers: [],
    })

    beforeEach(() => {
      component = shallow(
        <ParticipantCardView
          participant={participant}
          mode='edit'
          onCancel={onCancel}
          onChange={onChange}
          onSave={onSave}
        />
      )
    })

    it('renders the participants edit view', () => {
      expect(component.find('ParticipantEditView').length).toEqual(1)
    })

    it('and onEdit is called on ParticipantEditView renders the show view', () => {
      component.find('ParticipantEditView').props().onCancel()
      expect(component.find('ParticipantShowView').length).toEqual(1)
    })

    it('and onSave is called on ParticipantEditView renders the show view', () => {
      component.find('ParticipantEditView').props().onSave()
      expect(component.find('ParticipantShowView').length).toEqual(1)
    })

    it('calls onChange from props with the appropriately changed values when onChange is called', () => {
      const updatedParticipant = participant.setIn(['first_name'], 'Bart')
      component.find('ParticipantEditView').props().onChange(['first_name'], 'Bart')
      expect(onChange).toHaveBeenCalledWith(participantId, updatedParticipant)
    })
  })
})
