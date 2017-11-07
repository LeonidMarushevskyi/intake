import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {shallow} from 'enzyme'
import {requiredProps} from '../ScreeningPageSpec'

describe('ScreeningPage', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
  })

  describe('participants-related functions', () => {
    const promiseObj = jasmine.createSpyObj('promise', ['then'])
    promiseObj.then.and.callFake((thenFunction) => thenFunction())

    const savePerson = jasmine.createSpy('savePerson').and.returnValue(promiseObj)
    const createPerson = jasmine.createSpy('createPerson')

    const address1 = Immutable.Map({
      city: 'Sacramento',
      id: '12',
      state: 'California',
      street_address: '123 Camino ave',
      type: 'Home',
      zip: '94533',
    })
    const address2 = Immutable.Map({
      city: 'Sac',
      id: '13',
      state: 'California',
      street_address: '123 Fake ave',
      type: 'Home',
      zip: '94532',
    })

    const participantId1 = '123'
    const participant1 = Immutable.Map({
      id: participantId1,
      first_name: 'Bart',
      last_name: 'Simpson',
      gender: 'male',
      ssn: '987654321',
      date_of_birth: null,
      legacy_id: '1',
      screening_id: '3',
      addresses: Immutable.List([address1, address2]),
      roles: [],
    })

    const participantId2 = '456'
    const participant2 = Immutable.Map({
      id: participantId2,
      first_name: 'Marge',
      last_name: 'Simpson',
      gender: 'female',
      ssn: '123456789',
      date_of_birth: null,
      legacy_id: '2',
      screening_id: '3',
      addresses: Immutable.List(),
      roles: [],
    })

    const props = {
      ...requiredProps,
      actions: {createPerson, savePerson},
      params: {id: '3'},
      participants: Immutable.List([participant1, participant2]),
      editable: true,
    }

    let component

    beforeEach(() => {
      component = shallow(<ScreeningPage {...props} />)
    })

    describe('createParticipant', () => {
      const legacy_descriptor = {
        legacy_ui_id: '123-456-789',
        legacy_table_description: 'Client',
      }
      const person = {id: '3', legacy_descriptor: legacy_descriptor}
      const participant = {
        id: null,
        legacy_descriptor: legacy_descriptor,
        screening_id: props.params.id,
        legacy_id: person.id,
      }

      it('calls the createParticipant action', () => {
        component.instance().createParticipant(person)
        expect(createPerson).toHaveBeenCalledWith(participant)
      })
    })

    describe('cancelParticipantEdit', () => {
      it('removes all edits for only the specified participant', () => {
        const updatedParticipant1 = participant1.setIn(['first_name'], 'shere khan')
        const updatedParticipant2 = participant1.setIn(['last_name'], 'Simpsoooooon')

        component.instance().setParticipantField(participantId1, updatedParticipant1)
        component.instance().setParticipantField(participantId2, updatedParticipant2)

        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(updatedParticipant1)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(updatedParticipant2)

        component.instance().cancelParticipantEdit(participantId1)

        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(undefined)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(updatedParticipant2)
      })
    })

    describe('setParticipantField', () => {
      it('sets edits for only the specified participant', () => {
        const updatedParticipant = participant2.setIn(['last_name'], 'Simpsoooooon')
        component.instance().setParticipantField(participantId2, updatedParticipant)
        expect(component.instance().state.participantsEdits.get(participantId1)).toEqual(undefined)
        expect(component.instance().state.participantsEdits.get(participantId2)).toEqual(updatedParticipant)
      })
    })

    describe('saveParticipant', () => {
      it('uses the appropriate data and makes an API request', () => {
        const updatedParticipant = participant1.setIn(['first_name'], 'shere khan')
        component.instance().saveParticipant(updatedParticipant)
        expect(savePerson).toHaveBeenCalledWith(updatedParticipant.toJS())
      })
    })

    describe('participants', () => {
      it('uses the data stored at the server when there are no current edits', () => {
        const participants = Immutable.List([participant1, participant2])
        expect(component.instance().participants()).toEqual(participants)
      })

      it('uses edits made by the user when they are available', () => {
        const editedParticipant = participant1.set('first_name', 'Homer')
        component.instance().setParticipantField(participantId1, editedParticipant)
        const participants = Immutable.List([editedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('does not break when there are edits to one item in the list, but not others', () => {
        const editedParticipant = participant2.set('first_name', 'Lisa')
        component.instance().setParticipantField(participantId2, editedParticipant)
        const participants = Immutable.List([participant1, editedParticipant])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('reflects edits made to a participant address', () => {
        const updatedAddress = address1.set('street_address', '555 real st')
        const updatedParticipant = participant1.set('addresses', Immutable.List([updatedAddress, address2]))
        component.instance().setParticipantField(participantId1, updatedParticipant)
        const participants = Immutable.List([updatedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })

      it('reflects when a participant address is deleted', () => {
        const updatedParticipant = participant1.set('addresses', Immutable.List([address2]))
        component.instance().setParticipantField(participantId1, updatedParticipant)
        const participants = Immutable.List([updatedParticipant, participant2])
        expect(Immutable.is(component.instance().participants(), participants)).toEqual(true)
      })
    })
  })
})
