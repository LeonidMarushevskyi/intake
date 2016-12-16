import * as Utils from 'utils/http'
import * as screeningActions from 'actions/screeningActions'
import * as types from 'actions/actionTypes'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('screening actions', () => {
  describe('createScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    const store = mockStore()
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(screening))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('posts the screening to the server', () => {
      store.dispatch(screeningActions.createScreening())
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/screenings',
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

  describe('fetchScreening', () => {
    const screeningId = 1
    const store = mockStore()
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
        `/screenings/${screeningId}.json`,
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

  describe('saveScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    const store = mockStore()
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(screening))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('puts the screening to the server', () => {
      store.dispatch(screeningActions.saveScreening(screening))
      expect(Utils.request).toHaveBeenCalledWith(
        'PUT',
        `/screenings/${screening.id}.json`,
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

  describe('createParticipant', () => {
    const participant = {screening_id: 1, person_id: 2, id: null}
    const store = mockStore()
    beforeEach(() => {
      const promiseObject = jasmine.createSpyObj('PromiseSpyObj', ['then'])
      promiseObject.then.and.callFake((thenFunction) => thenFunction(participant))
      spyOn(Utils, 'request').and.returnValue(promiseObject)
    })

    it('posts the participant to the server', () => {
      store.dispatch(screeningActions.createParticipant(participant))
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/screenings/1/participants.json',
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
})
