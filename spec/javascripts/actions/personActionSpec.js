import $ from 'jquery'
import * as Utils from 'utils/http'
import * as personActions from 'actions/personActions'
import * as types from 'actions/actionTypes'
import Immutable from 'immutable'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('person actions', () => {
  describe('fetchPerson', () => {
    it('dispatches fetchPersonRequest and fetchPersonSuccess', () => {
      const person = {id: 1, first_name: 'Bart'}
      const fakeXhrResp = {responseJSON: person}
      spyOn(Utils, 'request').and.returnValue($.Deferred().resolve(fakeXhrResp))

      const expectedActions = [
        {type: types.FETCH_PERSON_SUCCESS, person: Immutable.fromJS(person)},
      ]
      const store = mockStore()

      store.dispatch(personActions.fetchPerson(person.id))
      expect(Utils.request).toHaveBeenCalledWith('GET', '/people/1.json')
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
