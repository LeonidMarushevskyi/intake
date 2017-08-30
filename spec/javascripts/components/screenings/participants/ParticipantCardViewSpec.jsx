import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import ParticipantCardView from 'screenings/ParticipantCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('Participant card view', () => {
  describe('When release two is inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    })

    describe('ParticipantCardView', () => {
      it('renders the card header', () => {
        const participant = Immutable.fromJS({
          id: '123',
          first_name: 'Alex',
          last_name: 'Doe',
          sealed: true,
        })
        const onCancel = jasmine.createSpy('onCancel')
        const mode = 'show'
        const editable = true
        const props = {participant, onCancel, mode, editable}
        const component = shallow(<ParticipantCardView {...props} />)
        const header = component.find('ParticipantCardHeader')
        expect(header.length).toEqual(1)
        expect(header.props().informationFlag).toEqual('Sealed')
        expect(header.props().onDelete).toEqual(jasmine.any(Function))
        expect(header.props().onEdit).toEqual(component.instance().onEdit)
        expect(header.props().showEdit).toEqual(true)
        expect(header.props().title).toEqual('Alex Doe')
      })

      describe('#onEdit', () => {
        it('toggles the mode to edit', () => {
          const component = shallow(<ParticipantCardView participant={Immutable.Map()} mode={'show'} editable={true}/>)
          const instance = component.instance()
          instance.onEdit()
          expect(instance.state.mode).toEqual('edit')
        })
      })

      describe('#onCancel', () => {
        let instance
        let onCancel
        const participant = Immutable.fromJS({id: '123'})
        beforeEach(() => {
          onCancel = jasmine.createSpy('onCancel')
          const component = shallow(<ParticipantCardView {...{participant, onCancel, mode: 'edit', editable: true}} />)
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
        const phoneNumberOne = {number: '(123)345-8899'}
        const phoneNumberTwo = {number: '1112223333'}
        const participant = Immutable.fromJS({id: '123', phone_numbers: [phoneNumberOne, phoneNumberTwo]})
        beforeEach(() => {
          onSave = jasmine.createSpy('onSave')
          const component = shallow(<ParticipantCardView {...{participant, onSave, mode: 'edit', editable: true}} />)
          instance = component.instance()
          instance.onSave()
        })

        it('toggles the mode to show', () => {
          expect(instance.state.mode).toEqual('show')
        })

        it('calls onSave', () => {
          expect(onSave).toHaveBeenCalled()
        })

        it('sanitizes participants phone numbers', () => {
          expect(onSave.calls.argsFor(0)[0].toJS()).toEqual(
            {
              id: '123',
              phone_numbers: [{
                number: '1233458899',
              }, {
                number: '1112223333',
              }],
            }
          )
        })
      })

      describe('when mode is set to show', () => {
        let component

        beforeEach(() => {
          const participant = Immutable.fromJS({id: '5', first_name: 'Tony', last_name: 'Hawk', roles: []})
          component = shallow(<ParticipantCardView participant={participant} mode='show' editable={true}/>)
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
              editable={true}
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
  })

  describe('when release two is active', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(false)
    })

    it('does not show the edit link', () => {
      const participant = Immutable.fromJS({id: '123', first_name: 'Alex', last_name: 'Doe'})
      const onCancel = jasmine.createSpy('onCancel')
      const mode = 'show'
      const editable = true
      const props = {participant, onCancel, mode, editable}
      const component = shallow(<ParticipantCardView {...props} />)
      const header = component.find('ParticipantCardHeader')
      expect(header.length).toEqual(1)
      expect(header.props().showEdit).toEqual(false)
    })
  })
})
