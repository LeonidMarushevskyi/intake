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
      const person = {id: '1', first_name: 'Bart'}
      const jsonResponse = person
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      spyOn(Utils, 'request').and.returnValue(promiseSpyObj)
      promiseSpyObj.then.and.callFake((then) => then(jsonResponse))

      const expectedActions = [
        {type: types.FETCH_PERSON_SUCCESS, person: Immutable.fromJS(jsonResponse)},
      ]
      const store = mockStore()

      store.dispatch(personActions.fetchPerson(person.id))
      expect(Utils.request).toHaveBeenCalledWith('GET', '/api/v1/people/1')
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('createPerson', () => {
    it('dispatches createPersonRequest and createPersonSuccess', () => {
      const person = {first_name: 'Bart'}
      const jsonResponse = {id: '1', first_name: 'Bart'}
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      spyOn(Utils, 'request').and.returnValue(promiseSpyObj)
      promiseSpyObj.then.and.callFake((then) => then(jsonResponse))

      const expectedActions = [
        {type: types.CREATE_PERSON_SUCCESS, person: Immutable.fromJS(jsonResponse)},
      ]
      const store = mockStore()

      store.dispatch(personActions.createPerson(person))
      expect(Utils.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/people',
        JSON.stringify({person: person}),
        {contentType: 'application/json'}
      )
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('Parse Blank Addresses', () => {
    it('parse blank addresses', () => {
      const address1 = {
        street_address: 'fake st',
        city: null,
        state: null,
        zip: '12455',
        type: null,
      }
      const address2 = {
        street_address: '   ',
        city: '',
        state: '',
        zip: '',
        type: '',
      }
      const address3 = {
        street_address: null,
        city: null,
        state: null,
        zip: null,
        type: null,
      }

      const person = {first_name: 'Simpson', addresses: [address1, address2, address3]}
      const newPerson = {first_name: 'Simpson', addresses: [address1]}
      const store = mockStore()
      store.dispatch(personActions.parseBlankAddresses(person))
      expect(person).toEqual(newPerson)
    })
  })

  describe('Parse Blank PhoneNumbers', () => {
    it('parse blank phonenumbers', () => {
      const phoneNumber1 = {number: '2134517895', type: ''}
      const phoneNumber2 = {number: '', type: 'HOME'}
      const phoneNumber3 = {number: null, type: null}
      const person = {first_name: 'Jane', phone_numbers: [phoneNumber1, phoneNumber2, phoneNumber3]}
      const newPerson = {first_name: 'Jane', phone_numbers: [phoneNumber1]}

      const store = mockStore()
      store.dispatch(personActions.parseBlankPhoneNumber(person))
      expect(person).toEqual(newPerson)
    })
  })

  describe('updatePerson', () => {
    it('dispatches updatePersonRequest and updatePersonSuccess', () => {
      const updatedPerson = {id: '1', first_name: 'Lisa', last_name: 'Simpson'}
      const promiseSpyObj = jasmine.createSpyObj('promiseSpyObj', ['then'])
      spyOn(Utils, 'request').and.returnValue(promiseSpyObj)
      promiseSpyObj.then.and.callFake((then) => then(updatedPerson))

      const expectedActions = [
        {type: types.UPDATE_PERSON_SUCCESS, person: Immutable.fromJS(updatedPerson)},
      ]

      const store = mockStore({
        person: Immutable.fromJS({
          id: '1',
          first_name: 'Bart',
          last_name: 'Simpson',
        }),
      })
      store.dispatch(personActions.updatePerson(updatedPerson))
      expect(Utils.request).toHaveBeenCalledWith(
        'PUT',
        '/api/v1/people/1',
        JSON.stringify({person: updatedPerson}),
        {contentType: 'application/json'}
      )
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
