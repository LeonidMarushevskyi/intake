import {Map, fromJS} from 'immutable'
import {
  buildSuccess,
  setField,
  touchField,
  touchAllFields,
  selectPerson,
  deselectPerson,
} from 'actions/contactFormActions'
import {createSuccess} from 'actions/contactActions'
import * as matchers from 'jasmine-immutable-matchers'
import contactFormReducer from 'reducers/contactFormReducer'

describe('contactReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on BUILD_CONTACT_SUCCESS', () => {
    it('returns the contact', () => {
      const people = [
        {first_name: 'Bob', last_name: 'Smith', legacy_descriptor: '1'},
        {first_name: 'Jane', last_name: 'Doe', legacy_descriptor: '2'},
      ]
      const action = buildSuccess({investigation_id: '123', investigation_started_at: 'date time', people})
      expect(contactFormReducer(Map(), action)).toEqualImmutable(
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
          investigation_started_at: {
            value: 'date time',
          },
          people: [
            {
              first_name: 'Bob',
              last_name: 'Smith',
              middle_name: undefined,
              name_suffix: undefined,
              legacy_descriptor: '1',
              selected: false,
              touched: false,
            }, {
              first_name: 'Jane',
              last_name: 'Doe',
              middle_name: undefined,
              name_suffix: undefined,
              legacy_descriptor: '2',
              selected: false,
              touched: false,
            },
          ],
        })
      )
    })
  })

  describe('on SET_CONTACT_FIELD', () => {
    it('returns the contact with the newly updated value, but touched remains the same', () => {
      const action = setField('started_at', 'ABC')
      const state = fromJS({started_at: {value: '123', touched: false}})
      expect(contactFormReducer(state, action)).toEqualImmutable(
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
      expect(contactFormReducer(state, action)).toEqualImmutable(
        fromJS({
          started_at: {
            value: '123',
            touched: true,
          },
        })
      )
    })
  })

  describe('on TOUCH_ALL_CONTACT_FIELDS', () => {
    it('returns the contact with all fields with touch touched set to true', () => {
      const action = touchAllFields()
      const initialContactForm = fromJS({
        id: {value: '123'},
        investigation_id: {value: '111'},
        started_at: {value: 'a datetime', touched: false},
        status: {value: 'a status value', touched: false},
        note: {value: 'a sample note'},
        purpose: {value: 'a purpose value', touched: false},
        communication_method: {value: 'a communication method value', touched: false},
        location: {value: 'a location value', touched: false},
        investigation_started_at: {value: 'a datetime'},
      })
      expect(contactFormReducer(initialContactForm, action)).toEqualImmutable(
        fromJS({
          id: {value: '123'},
          investigation_id: {value: '111'},
          started_at: {value: 'a datetime', touched: true},
          status: {value: 'a status value', touched: true},
          note: {value: 'a sample note'},
          purpose: {value: 'a purpose value', touched: true},
          communication_method: {value: 'a communication method value', touched: true},
          location: {value: 'a location value', touched: true},
          investigation_started_at: {value: 'a datetime'},
        })
      )
    })
  })

  describe('on SELECT_CONTACT_PERSON', () => {
    it('changes the selected and touched flags for the passed index to true', () => {
      const action = selectPerson('1')
      const state = fromJS({people: [{selected: false, touched: false}, {selected: false, touched: false}]})
      expect(contactFormReducer(state, action)).toEqualImmutable(
        fromJS({
          people: [
            {selected: false, touched: false},
            {selected: true, touched: true},
          ],
        })
      )
    })
  })

  describe('on DESELECT_CONTACT_PERSON', () => {
    it('changes the selected value for the passed index to false, and the touched flag to true', () => {
      const action = deselectPerson('1')
      const state = fromJS({people: [{selected: true, touched: false}, {selected: true, touched: false}]})
      expect(contactFormReducer(state, action)).toEqualImmutable(
        fromJS({
          people: [
            {selected: true, touched: false},
            {selected: false, touched: true},
          ],
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
      expect(contactFormReducer(initialContact, action)).toEqualImmutable(
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
