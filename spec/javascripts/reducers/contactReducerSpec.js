import {Map, fromJS} from 'immutable'
import {
  build,
  setField,
  touchField,
  createSuccess,
} from 'actions/contactActions'
import * as matchers from 'jasmine-immutable-matchers'
import contactReducer from 'reducers/contactReducer'

describe('contactReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_CONTACT', () => {
    it('returns the contact', () => {
      const action = build({investigation_id: '123'})
      expect(contactReducer(Map(), action)).toEqualImmutable(
        fromJS({
          id: {
            value: null,
          },
          investigation_id: {
            value: '123',
          },
          started_at: {
            value: null,
            touched: false,
          },
          status: {
            value: null,
            touched: false,
          },
          note: {
            value: null,
          },
          purpose: {
            value: null,
            touched: false,
          },
          communication_method: {
            value: null,
            touched: false,
          },
          location: {
            value: null,
            touched: false,
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
      const action = touchField('started_at')
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

  describe('on CREATE_CONTACT_SUCCESS', () => {
    it('returns the created contact', () => {
      const action = createSuccess({
        id: '123',
        started_at: 'some date time',
        status: 'a contact status code',
        note: 'sample note',
        purpose: 'a purpose code',
        communication_method: 'Shouting',
        location: 'School',
      })
      const initialContact = fromJS({
        id: {
          value: null,
        },
        investigation_id: {
          value: 'investigation Id',
        },
        started_at: {
          value: null,
          touched: true,
        },
        status: {
          value: null,
          touched: false,
        },
        note: {
          value: null,
        },
        purpose: {
          value: null,
          touched: false,
        },
        communication_method: {
          value: null,
          touched: false,
        },
        location: {
          value: null,
          touched: false,
        },
      })
      expect(contactReducer(initialContact, action)).toEqualImmutable(
        fromJS({
          id: {
            value: '123',
          },
          investigation_id: {
            value: 'investigation Id',
          },
          started_at: {
            value: 'some date time',
            touched: true,
          },
          status: {
            value: 'a contact status code',
            touched: false,
          },
          note: {
            value: 'sample note',
          },
          purpose: {
            value: 'a purpose code',
            touched: false,
          },
          communication_method: {
            value: 'Shouting',
            touched: false,
          },
          location: {
            value: 'School',
            touched: false,
          },
        })
      )
    })
  })
})
