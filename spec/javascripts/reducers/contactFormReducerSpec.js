import {Map, fromJS} from 'immutable'
import {
  buildSuccess,
  deselectPerson,
  editSuccess,
  selectPerson,
  setField,
  touchAllFields,
  touchField,
} from 'actions/contactFormActions'
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
      const action = buildSuccess({
        investigation_id: '123',
        investigation_started_at: 'date time',
        investigation_people: people,
      })
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
        people: [{selected: false}, {selected: true}],
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
          people: [{selected: false, touched: true}, {selected: true, touched: true}],
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

  describe('on EDIT_CONTACT_SUCCESS', () => {
    it('returns the contact with the investigation people merged', () => {
      const investigationPeople = [
        {first_name: 'Bob', legacy_descriptor: {legacy_id: 'bobs legacy id'}},
        {first_name: 'Jane', last_name: 'Doe', legacy_descriptor: {legacy_id: 'janes legacy id'}},
      ]
      const contact = {
        id: 'existing_contact_id',
        started_at: 'a date time',
        status: 'a contact status',
        note: 'a sample note',
        purpose: 'a contact purpose',
        communication_method: 'a communication method',
        location: 'a location',
        people: [{first_name: 'Jane', last_name: 'Doe', legacy_descriptor: {legacy_id: 'janes legacy id'}}],
      }
      const action = editSuccess({
        investigation_id: 'existing_investigation_id',
        investigation_started_at: 'investigation date time',
        investigation_people: investigationPeople,
        contact,
      })
      expect(contactFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          id: {
            value: 'existing_contact_id',
          },
          investigation_id: {
            value: 'existing_investigation_id',
          },
          started_at: {
            value: 'a date time',
            touched: false,
          },
          status: {
            value: 'a contact status',
            touched: false,
          },
          note: {
            value: 'a sample note',
          },
          purpose: {
            value: 'a contact purpose',
            touched: false,
          },
          communication_method: {
            value: 'a communication method',
            touched: false,
          },
          location: {
            value: 'a location',
            touched: false,
          },
          investigation_started_at: {
            value: 'investigation date time',
          },
          people: [
            {
              first_name: 'Bob',
              last_name: undefined,
              middle_name: undefined,
              name_suffix: undefined,
              legacy_descriptor: {legacy_id: 'bobs legacy id'},
              selected: false,
              touched: false,
            }, {
              first_name: 'Jane',
              last_name: 'Doe',
              middle_name: undefined,
              name_suffix: undefined,
              legacy_descriptor: {legacy_id: 'janes legacy id'},
              selected: true,
              touched: false,
            },
          ],
        })
      )
    })
  })
})
