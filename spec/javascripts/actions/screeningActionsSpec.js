import * as Utils from 'utils/http'
import * as screeningActions from 'actions/screeningActions'
import * as types from 'actions/actionTypes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('screening actions', () => {
  let store
  beforeEach(() => {
    store = mockStore()
  })

  describe('.createScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(screening))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('posts the screening to the server', () => {
      store.dispatch(screeningActions.createScreening())
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/screenings',
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a createScreeningSuccess', () => {
      store.dispatch(screeningActions.createScreening())
      expect(store.getActions()[0].type).toEqual(types.CREATE_SCREENING_SUCCESS)
      expect(store.getActions()[0].screening.toJS()).toEqual(screening)
    })
  })

  describe('.fetchScreening', () => {
    const screeningId = '1'
    const screening = {id: '1', name: 'mock_screening'}
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(screening))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('fetches the screening for a given screeningId', () => {
      store.dispatch(screeningActions.fetchScreening(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'GET',
        `/api/v1/screenings/${screeningId}`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a fetchScreeningSuccess', () => {
      store.dispatch(screeningActions.fetchScreening(screeningId))
      expect(store.getActions()[0].type).toEqual(types.FETCH_SCREENING_SUCCESS)
      expect(store.getActions()[0].screening.toJS()).toEqual(screening)
    })
  })

  describe('.saveScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(screening))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('puts the screening to the server', () => {
      store.dispatch(screeningActions.saveScreening(screening))
      expect(Utils.request).toHaveBeenCalledWith(
        'PUT',
        `/api/v1/screenings/${screening.id}`,
        JSON.stringify({screening: screening}),
        {contentType: 'application/json'}
      )
    })

    it('dispatches a updateScreeningSuccess', () => {
      store.dispatch(screeningActions.saveScreening(screening))
      expect(store.getActions()[0].type).toEqual(types.UPDATE_SCREENING_SUCCESS)
      expect(store.getActions()[0].screening.toJS()).toEqual(screening)
    })
  })

  describe('.submitScreening', () => {
    const screeningId = '3'
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction({}))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('submits a screening to the server', () => {
      store.dispatch(screeningActions.submitScreening(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        `/api/v1/screenings/${screeningId}/submit`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a submitScreeningSuccess', () => {
      store.dispatch(screeningActions.submitScreening(screeningId))
      expect(store.getActions()[0].type).toEqual(types.SUBMIT_SCREENING_SUCCESS)
    })
  })

  describe('.saveParticipant', () => {
    const participant = {
      screening_id: '1',
      person_id: '2',
      id: '199',
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    }
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(participant))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('puts the participants to the server', () => {
      store.dispatch(screeningActions.saveParticipant(participant))
      expect(Utils.request).toHaveBeenCalledWith(
        'PUT',
        `/api/v1/participants/${participant.id}`,
        JSON.stringify({participant: participant}),
        {contentType: 'application/json'}
      )
    })

    it('dispatches a updateParticipantSuceess', () => {
      store.dispatch(screeningActions.saveParticipant(participant))
      expect(store.getActions()[0].type).toEqual(types.UPDATE_PARTICIPANT_SUCCESS)
      expect(store.getActions()[0].participant.toJS()).toEqual(participant)
    })
  })

  describe('.createParticipant', () => {
    const participant = {screening_id: '1', person_id: '2', id: null}
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(participant))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('posts the participant to the server', () => {
      store.dispatch(screeningActions.createParticipant(participant))
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/participants',
        JSON.stringify({participant: participant}),
        {contentType: 'application/json'}
      )
    })

    it('dispatches a createParticipantSuccess', () => {
      store.dispatch(screeningActions.createParticipant(participant))
      expect(store.getActions()[0].type).toEqual(types.CREATE_PARTICIPANT_SUCCESS)
      expect(store.getActions()[0].participant.toJS()).toEqual(participant)
    })
  })

  describe('.deleteParticipant', () => {
    const participant = {screening_id: '1', person_id: '2', id: '1'}
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(participant))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('deletes the participant on the server', () => {
      store.dispatch(screeningActions.deleteParticipant(participant.id))
      expect(Utils.request).toHaveBeenCalledWith(
        'DELETE',
        `/api/v1/participants/${participant.id}`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a deleteParticipantSuccess', () => {
      store.dispatch(screeningActions.deleteParticipant(participant.id))
      expect(store.getActions()[0].type).toEqual(types.DELETE_PARTICIPANT_SUCCESS)
    })
  })

  describe('.fetchHistoryOfInvolvements', () => {
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction())
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('fetches the history of involvements from the server', () => {
      const screeningId = 22
      store.dispatch(screeningActions.fetchHistoryOfInvolvements(screeningId))
      expect(Utils.request).toHaveBeenCalledWith(
        'GET',
        `/api/v1/screenings/${screeningId}/history_of_involvements`,
        null,
        {contentType: 'application/json'}
      )
    })

    it('dispatches a fetchHistoryOfInvolvementsSuccess', () => {
      store.dispatch(screeningActions.fetchHistoryOfInvolvements())
      expect(store.getActions()[0].type).toEqual(types.FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS)
    })
  })
})
