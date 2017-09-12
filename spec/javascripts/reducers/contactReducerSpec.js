import {Map} from 'immutable'
import {setContact} from 'actions/contactActions'
import * as matchers from 'jasmine-immutable-matchers'
import contactReducer from 'reducers/contactReducer'

describe('contactReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_CONTACT', () => {
    it('returns the contact', () => {
      const action = setContact({
        investigation_id: '123',
        started_at: '2016-08-11T18:24:22.157Z',
      })
      expect(contactReducer(Map(), action)).toEqual(
        Map({
          investigation_id: '123',
          started_at: '2016-08-11T18:24:22.157Z',
        })
      )
    })
  })
})
