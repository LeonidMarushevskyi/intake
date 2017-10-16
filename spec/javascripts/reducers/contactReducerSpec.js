import {Map, fromJS} from 'immutable'
import {fetchSuccess} from 'actions/contactActions'
import * as matchers from 'jasmine-immutable-matchers'
import contactReducer from 'reducers/contactReducer'

describe('contactReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_CONTACT_SUCCESS', () => {
    it('returns the fetched contact', () => {
      const action = fetchSuccess('investigation Id', {
        id: '123',
        started_at: 'some date time',
        status: 'a contact status code',
        note: 'sample note',
        purpose: 'a purpose code',
        communication_method: 'Shouting',
        location: 'School',
        people: [{id: 1}],
      })
      const initialContact = Map()
      expect(contactReducer(initialContact, action)).toEqualImmutable(
        fromJS({
          id: '123',
          investigation_id: 'investigation Id',
          started_at: 'some date time',
          status: 'a contact status code',
          note: 'sample note',
          purpose: 'a purpose code',
          communication_method: 'Shouting',
          location: 'School',
          people: [{id: 1}],
        })
      )
    })
  })
})
