import * as personActions from 'actions/personActions'
import * as screeningActions from 'actions/screeningActions'
import Immutable from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    initialState = {
      person: Immutable.Map(),
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

  it('handles fetch person', () => {
    expect(store.getState()).toEqual(initialState)
    const person = {
      id: '1',
      first_name: 'Kevin',
      last_name: 'McCallister',
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
      address: {
        id: '3',
        street_address: '671 Lincoln Avenue',
        city: 'Winnetka',
        state: 'IL',
        zip: '60093',
      },
    }
    const action = personActions.fetchPersonSuccess(person)
    store.dispatch(action)
    expect(store.getState().person.toJS()).toEqual(person)
  })

  it('handles create person', () => {
    const person = {
      id: '1',
      first_name: 'Kevin',
      last_name: 'McCallister',
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
      address: {
        id: '3',
        street_address: '671 Lincoln Avenue',
        city: 'Winnetka',
        state: 'IL',
        zip: '60093',
      },
    }
    const action = personActions.createPersonSuccess(person)
    store.dispatch(action)
    expect(store.getState().person.toJS()).toEqual(person)
  })

  it('handles update person', () => {
    initialState = {
      ...initialState,
      person: Immutable.fromJS({
        id: '1',
        first_name: 'Kevin',
        last_name: 'McCallister',
        gender: 'female',
        date_of_birth: '11/16/1990',
        ssn: '111223333',
        address: {
          id: '3',
          street_address: '671 Lincoln Avenue',
          city: 'Winnetka',
          state: 'IL',
          zip: '60093',
        },
      }),
    }
    store = createStore(rootReducer, initialState)
    expect(store.getState()).toEqual(initialState)
    const updatedPerson = initialState.person.set('first_name', 'Bart').toJS()
    const action = personActions.updatePersonSuccess(updatedPerson)
    store.dispatch(action)
    expect(store.getState().person.toJS()).toEqual(updatedPerson)
  })

  it('handles fetch screening', () => {
    const participant = {id: '2', person_id: '3', screening_id: '1'}
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
    const participant = {id: '2', person_id: '3', screening_id: '1'}
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
