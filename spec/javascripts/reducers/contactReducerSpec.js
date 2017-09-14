import {Map, fromJS} from 'immutable'
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
        status: 'C',
      })
      expect(contactReducer(Map(), action)).toEqual(
        fromJS({
          investigation_id: {
            value: '123',
            touched: false,
          }, started_at: {
            value: '2016-08-11T18:24:22.157Z',
            touched: false,
          }, status: {
            value: 'C',
            touched: false,
          },
        })
      )
    })
  })
})
