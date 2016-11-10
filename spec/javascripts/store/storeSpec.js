import * as personActions from 'actions/personActions'
import Immutable from 'immutable'
import rootReducer from 'reducers'
import {createStore} from 'redux'

describe('Store', () => {
  let initialState
  let store
  beforeEach(() => {
    initialState = {person: Immutable.Map()}
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
})
