import {Map, fromJS} from 'immutable'
import {build, setField, touchContactField} from 'actions/contactActions'
import * as matchers from 'jasmine-immutable-matchers'
import contactReducer from 'reducers/contactReducer'

describe('contactReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_CONTACT', () => {
    it('returns the contact', () => {
      const action = build({investigation_id: '123'})
      expect(contactReducer(Map(), action)).toEqual(
        fromJS({
          investigation_id: {
            value: '123',
          }, started_at: {
            value: null,
            touched: false,
          }, status: {
            value: null,
            touched: false,
          }, note: {
            value: null,
          },
        })
      )
    })
  })

  describe('on SET_CONTACT_FIELD', () => {
    it('returns the contact with the newly updated value, but touched remains the same', () => {
      const action = setField('started_at', 'ABC')
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
