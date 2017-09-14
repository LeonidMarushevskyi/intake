import {Map, fromJS} from 'immutable'
import {setContact, setContactField, touchContactField} from 'actions/contactActions'
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

  describe('on SET_CONTACT_FIELD', () => {
    it('returns the contact with the newly updated value, but touched remains the same', () => {
      const action = setContactField('started_at', 'ABC')
      const state = fromJS({started_at: {value: '123', touched: false}})
      expect(contactReducer(state, action)).toEqualImmutable(
        fromJS({
          started_at: {
            value: 'ABC',
            touched: false,
          },
        })
      )
    })
  })

  describe('on TOUCH_CONTACT_FIELD', () => {
    it('returns the contact with touched set to true, but the value remains the same', () => {
      const action = touchContactField('started_at')
      const state = fromJS({started_at: {value: '123', touched: false}})
      expect(contactReducer(state, action)).toEqualImmutable(
        fromJS({
          started_at: {
            value: '123',
            touched: true,
          },
        })
      )
    })
  })
})
