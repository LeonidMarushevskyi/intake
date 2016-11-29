import * as personActions from 'actions/personActions'
import Immutable from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    initialState = {person: Immutable.Map(), screening: Immutable.Map()}
    store = createStore(rootReducer, initialState)
  })

  it('handles fetch person', () => {
    expect(store.getState()).toEqual(initialState)
    const person = Immutable.fromJS({
      id: 1,
      first_name: 'Kevin',
      last_name: 'McCallister',
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
      address: {
        id: 3,
        street_address: '671 Lincoln Avenue',
        city: 'Winnetka',
        state: 'IL',
        zip: 60093,
      },
    })
    const action = personActions.fetchPersonSuccess(person)
    store.dispatch(action)

    expect(store.getState().person).toEqual(person)
  })

  it('handles create person', () => {
    expect(store.getState()).toEqual(initialState)
    const person = Immutable.fromJS({
      id: 1,
      first_name: 'Kevin',
      last_name: 'McCallister',
      gender: 'male',
      date_of_birth: '11/16/1990',
      ssn: '111223333',
      address: {
        id: 3,
        street_address: '671 Lincoln Avenue',
        city: 'Winnetka',
        state: 'IL',
        zip: 60093,
      },
    })
    const action = personActions.createPersonSuccess(person)
    store.dispatch(action)

    expect(store.getState().person).toEqual(person)
  })

  it('handles update person', () => {
    initialState = {
      ...initialState,
      person: Immutable.fromJS({
        id: 1,
        first_name: 'Kevin',
        last_name: 'McCallister',
        gender: 'female',
        date_of_birth: '11/16/1990',
        ssn: '111223333',
        address: {
          id: 3,
          street_address: '671 Lincoln Avenue',
          city: 'Winnetka',
          state: 'IL',
          zip: 60093,
        },
      }),
    }
    store = createStore(rootReducer, initialState)
    expect(store.getState()).toEqual(initialState)

    const updatedPerson = initialState.person.set('first_name', 'Bart')
    const action = personActions.updatePersonSuccess(updatedPerson)
    store.dispatch(action)
    expect(store.getState().person).toEqual(updatedPerson)
  })
})
