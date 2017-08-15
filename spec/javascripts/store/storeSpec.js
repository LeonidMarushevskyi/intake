import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    initialState = {
      screening: Immutable.Map(),
      participants: Immutable.List(),
      relationships: Immutable.List(),
      involvements: Immutable.List(),
    }
    store = createStore(rootReducer)
  })

  it('has initial state', () => {
    expect(store.getState()).toEqual(initialState)
  })

  it('handles fetch screening', () => {
    const participant = {id: '2', legacy_id: '3', screening_id: '1'}
    const screening = {
      id: '1',
      name: 'Mock screening',
      participants: [participant],
    }
    const action = screeningActions.fetchScreeningSuccess(screening)
    store.dispatch(action)
    expect(store.getState().screening.toJS()).toEqual(screening)
    expect(store.getState().participants.toJS()).toEqual([participant])
  })

  it('handles create screening', () => {
    const screening = {
      id: '1',
      name: 'Mock screening',
      participants: [],
    }
    const action = screeningActions.createScreeningSuccess(screening)
    store.dispatch(action)
    expect(store.getState().screening.toJS()).toEqual(screening)
    expect(store.getState().participants.toJS()).toEqual([])
  })

  it('handles update screening', () => {
    const participant = {id: '2', legacy_id: '3', screening_id: '1'}
    initialState = {
      ...initialState,
      screening: Immutable.fromJS({
        id: '1',
        name: 'Mock screening',
        participants: [],
      }),
    }
    store = createStore(rootReducer, initialState)
    const updatedScreening = initialState.screening
      .set('participants', Immutable.fromJS([participant])).toJS()
    const action = screeningActions.updateScreeningSuccess(updatedScreening)
    store.dispatch(action)
    expect(store.getState().screening.toJS()).toEqual(updatedScreening)
    expect(store.getState().participants.toJS()).toEqual([participant])
  })

  it('handles create participant', () => {
    const participant = {id: '2', legacy_id: '3', screening_id: '1'}
    initialState = {
      ...initialState,
      screening: Immutable.fromJS({
        id: '1',
        name: 'Mock screening',
        participants: [],
      }),
    }
    const action = screeningActions.createParticipantSuccess(participant)
    store.dispatch(action)
    expect(store.getState().participants.toJS()).toEqual([participant])
  })
})
