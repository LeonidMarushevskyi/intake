import * as matchers from 'jasmine-immutable-matchers'
import {
  fetchScreeningSuccess,
  createScreeningSuccess,
  updateScreeningSuccess,
  createParticipantSuccess,
} from 'actions/screeningActions'
import {fromJS} from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    jasmine.addMatchers(matchers)
    initialState = fromJS({
      communicationMethods: [],
      contact: {},
      contactForm: {},
      contactPurposes: [],
      contactStatuses: [],
      counties: [],
      countyAgencies: [],
      investigationPeople: [],
      involvements: [],
      locations: [],
      narrativeForm: {},
      participants: [],
      relationships: [],
      remoteError: {},
      routing: {locationBeforeTransitions: null},
      screening: {},
      screeningSummary: {},
      staff: {},
    })
    store = createStore(rootReducer)
  })

  it('has initial state', () => {
    expect(store.getState()).toEqualImmutable(initialState)
  })

  it('handles fetch screening', () => {
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [{id: '2', legacy_id: '3', screening_id: '1'}],
    })
    const participants = screening.get('participants')
    const action = fetchScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening')).toEqualImmutable(
      screening.set('fetch_status', 'FETCHED')
    )
    expect(store.getState().get('participants')).toEqualImmutable(participants)
  })

  it('handles create screening', () => {
    const screening = fromJS({
      id: '1',
      name: 'Mock screening',
      participants: [],
    })
    const action = createScreeningSuccess(screening.toJS())
    store.dispatch(action)
    expect(store.getState().get('screening')).toEqualImmutable(
      screening.set('fetch_status', 'FETCHED')
    )
    expect(store.getState().get('participants').isEmpty()).toEqual(true)
  })

  describe('when a screening already exists in the store', () => {
    beforeEach(() => {
      initialState = initialState.set(
        'screening',
        fromJS({
          id: '1',
          name: 'Mock screening',
          participants: [],
        })
      )
      store = createStore(rootReducer, initialState)
    })

    it('handles update screening', () => {
      const participants = fromJS([{id: '2', legacy_id: '3', screening_id: '1'}])
      const updatedScreening = initialState.get('screening').set('participants', participants)
      const action = updateScreeningSuccess(updatedScreening.toJS())
      store.dispatch(action)
      expect(store.getState().get('screening')).toEqualImmutable(
        updatedScreening.set('fetch_status', 'FETCHED')
      )
      expect(store.getState().get('participants')).toEqualImmutable(participants)
    })

    it('handles create participant', () => {
      const participant = {id: '2', legacy_id: '3', screening_id: '1'}
      const participants = fromJS([participant])
      const action = createParticipantSuccess(participant)
      store.dispatch(action)
      expect(store.getState().get('participants')).toEqualImmutable(participants)
    })
  })
})
