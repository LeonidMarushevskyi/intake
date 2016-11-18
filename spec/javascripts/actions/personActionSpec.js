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

  describe('createPerson', () => {
    it('dispatches createPersonRequest and createPersonSuccess', () => {
      const person = {first_name: 'Bart'}
      const fakeXhrResp = {responseJSON: Object.assign({id: 1}, person)}
      spyOn(Utils, 'request').and.returnValue($.Deferred().resolve(fakeXhrResp))

      const expectedActions = [
        {type: types.CREATE_PERSON_SUCCESS, person: Immutable.fromJS(fakeXhrResp.responseJSON)},
      ]
      const store = mockStore()

      store.dispatch(personActions.createPerson({person: person}))
      expect(Utils.request).toHaveBeenCalledWith('POST', '/people.json', {person: person})
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('updatePerson', () => {
    it('dispatches updatePersonRequest and updatePersonSuccess', () => {
      const updatedPerson = {id: 1, first_name: 'Lisa', last_name: 'Simpson'}
      const fakeXhrResp = {responseJSON: updatedPerson}
      spyOn(Utils, 'request').and.returnValue($.Deferred().resolve(fakeXhrResp))

      const expectedActions = [
        {type: types.UPDATE_PERSON_SUCCESS, person: Immutable.fromJS(fakeXhrResp.responseJSON)},
      ]

      const store = mockStore({
        person: Immutable.fromJS({
          id: 1,
          first_name: 'Bart',
          last_name: 'Simpson',
        }),
      })
      store.dispatch(personActions.updatePerson({person: updatedPerson}))
      expect(Utils.request).toHaveBeenCalledWith('PUT', '/people/1.json', {person: updatedPerson})
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
