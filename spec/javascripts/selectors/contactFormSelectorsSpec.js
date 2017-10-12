import {fromJS, Seq, List} from 'immutable'
import moment from 'moment'
import {
  getStatusValueSelector,
  getPurposeValueSelector,
  getLocationValueSelector,
  getCommunicationMethodValueSelector,
  getTouchedFieldsSelector,
  getErrorsSelector,
  getVisibleErrorsSelector,
  getHasErrorsValueSelector,
  getPeopleSelector,
  getFormattedContactPeople,
  getSelectedPeopleIdsSelector,
} from 'selectors/contactFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('contactFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getStatusValueSelector', () => {
    const contactStatuses = [{code: 'A', value: 'Attempted'}]

    it('returns the current contactForm status display value', () => {
      const contactForm = {status: {value: 'A'}}
      const state = fromJS({contactForm, contactStatuses})
      expect(getStatusValueSelector(state)).toEqual('Attempted')
    })

    it('returns undefined when contactForm does not have a status', () => {
      const contactForm = {status: {value: null}}
      const state = fromJS({contactForm, contactStatuses})
      expect(getStatusValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getPurposeValueSelector', () => {
    const contactPurposes = [{code: '123', value: 'SomePurpose'}]

    it('returns the current contactForm purpose display value', () => {
      const contactForm = {purpose: {value: '123'}}
      const state = fromJS({contactForm, contactPurposes})
      expect(getPurposeValueSelector(state)).toEqual('SomePurpose')
    })

    it('returns undefined when contactForm does not have a purpose', () => {
      const contactForm = {purpose: {value: null}}
      const state = fromJS({contactForm, contactPurposes})
      expect(getPurposeValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getLocationValueSelector', () => {
    const locations = [{code: '444', value: 'school'}]

    it('returns the current contactForm location display value', () => {
      const contactForm = {location: {value: '444'}}
      const state = fromJS({contactForm, locations})
      expect(getLocationValueSelector(state)).toEqual('school')
    })

    it('returns undefined when contactForm does not have a location', () => {
      const contactForm = {location: {value: null}}
      const state = fromJS({contactForm, locations})
      expect(getLocationValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getCommunicationMethodValueSelector', () => {
    const communicationMethods = [{code: '555', value: 'Phone'}]

    it('returns the current contactForm communication methods display value', () => {
      const contactForm = {communication_method: {value: '555'}}
      const state = fromJS({contactForm, communicationMethods})
      expect(getCommunicationMethodValueSelector(state)).toEqual('Phone')
    })

    it('returns undefined when contactForm does not have a communication method', () => {
      const contactForm = {communication_method: {value: null}}
      const state = fromJS({contactForm, communicationMethods})
      expect(getCommunicationMethodValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getTouchedFieldsSelector', () => {
    it('returns the contactForm field names that are touched', () => {
      const contactForm = {
        fieldA: {touched: false},
        fieldB: {touched: true},
        fieldC: {},
        fieldD: {touched: true},
      }
      const state = fromJS({contactForm})
      expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq(['fieldB', 'fieldD']))
    })

    it('returns empty list when no contact', () => {
      const contactForm = {}
      const state = fromJS({contactForm})
      expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq())
    })
  })

  describe('getContactErrorsSelector', () => {
    describe('started_at', () => {
      it('returns an object with an empty array for started_at when no errors are present', () => {
        const yesterday = moment().subtract(1, 'days').toISOString()
        const contactForm = {started_at: {value: yesterday}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List())
      })

      it('returns an error if started_at is missing from the contact', () => {
        const contactForm = {}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['Please enter a contact date']))
      })

      it('returns an error if started_at is an empty string', () => {
        const contactForm = {started_at: {value: ''}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['Please enter a contact date']))
      })

      it('returns an error if started_at is a date in the future', () => {
        const tomorrow = moment().add(1, 'days').toISOString()
        const contactForm = {started_at: {value: tomorrow}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(List(['The date and time cannot be in the future']))
      })

      it('returns an error if started_at is before the investigation date', () => {
        const contactForm = {
          started_at: {value: '2017-10-04T21:10:00.012'},
          investigation_started_at: {value: '2017-10-05T21:10:00.000'},
        }
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('started_at'))
          .toEqualImmutable(
            List(['The contact date/time must be after the investigation start date of 10/05/2017 9:10 PM'])
          )
      })
    })

    describe('communication_method', () => {
      it('returns an error if communication_method is missing from the contact', () => {
        const contactForm = {}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('communication_method'))
          .toEqualImmutable(
            List(['Please enter the communication method'])
          )
      })

      it('returns no error if communication_method is present', () => {
        const contactForm = {communication_method: {value: 'a communication method'}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('communication_method'))
          .toEqualImmutable(List())
      })
    })

    describe('location', () => {
      it('returns an error if location is missing from the contact', () => {
        const contactForm = {}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('location'))
          .toEqualImmutable(List(['Please enter the contact location']))
      })

      it('returns no error if location is present', () => {
        const contactForm = {location: {value: 'a location'}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('location'))
          .toEqualImmutable(List())
      })
    })

    describe('status', () => {
      it('returns an error if status is missing from the contact', () => {
        const contactForm = {}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('status'))
          .toEqual(List(['Please enter a contact status']))
      })

      it('returns no error if status is present', () => {
        const contactForm = {status: {value: 'a status'}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('status'))
          .toEqualImmutable(List())
      })
    })

    describe('purpose', () => {
      it('returns an error if purpose is missing from the contact', () => {
        const contactForm = {}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('purpose'))
          .toEqualImmutable(List(['Please enter a contact purpose']))
      })

      it('returns no error if purpose is present', () => {
        const contactForm = {purpose: {value: 'a purpose'}}
        const state = fromJS({contactForm})
        expect(getErrorsSelector(state).get('purpose'))
          .toEqualImmutable(List())
      })
    })
  })

  describe('getVisibleErrorsSelector', () => {
    it('returns an error if the field has a validation and is touched', () => {
      const contactForm = {
        purpose: {
          value: undefined,
          touched: true,
        },
      }
      const state = fromJS({contactForm})
      expect(getVisibleErrorsSelector(state).get('purpose'))
        .toEqualImmutable(List(['Please enter a contact purpose']))
    })

    it('does not return an error if the field has not been touched', () => {
      const yesterday = moment().subtract(1, 'days').toISOString()
      const contactForm = {
        started_at: {value: yesterday},
        investigation_started_at: {value: yesterday},
        communication_method: {value: 'a value'},
        location: {value: 'a value'},
        status: {value: 'a value'},
        purpose: {value: 'a value'},
      }
      const state = fromJS({contactForm})
      expect(getHasErrorsValueSelector(state)).toEqual(false)
    })
  })

  describe('getHasErrorsValueSelector', () => {
    it('returns true if contact form has errors present', () => {
      const contactForm = {
        purpose: {value: undefined},
      }
      const state = fromJS({contactForm})
      expect(getHasErrorsValueSelector(state)).toEqual(true)
    })
  })

  describe('getPeopleSelector', () => {
    it('returns the list of people on a contact form', () => {
      const contactForm = {
        people: [
          {first_name: 'Bob'},
          {first_name: 'Sally'},
        ],
      }
      const state = fromJS({contactForm})
      expect(getPeopleSelector(state)).toEqualImmutable(
        fromJS([
          {first_name: 'Bob'},
          {first_name: 'Sally'},
        ])
      )
    })

    it('returns an empty list of the contact form is empty', () => {
      const contactForm = {}
      const state = fromJS({contactForm})
      expect(getPeopleSelector(state)).toEqualImmutable(List())
    })
  })

  describe('getFormattedContactPeople', () => {
    it('returns the list of people on a contact form', () => {
      const contactForm = {
        people: [
          {first_name: 'Bob', last_name: 'Smith', selected: true, legacy_descriptor: '1'},
          {first_name: 'Sally', last_name: 'Doe', selected: false, legacy_descriptor: '2'},
        ],
      }
      const state = fromJS({contactForm})
      expect(getFormattedContactPeople(state)).toEqualImmutable(
        fromJS([
          {name: 'Bob Smith', selected: true},
          {name: 'Sally Doe', selected: false},
        ])
      )
    })

    it('returns an empty list of the contact form is empty', () => {
      const contactForm = {}
      const state = fromJS({contactForm})
      expect(getFormattedContactPeople(state)).toEqualImmutable(List())
    })
  })

  describe('getSelectedPeopleIdsSelector', () => {
    it('returns the ids of all people where selected is true', () => {
      const contactForm = {
        people: [
          {legacy_descriptor: {legacy_id: '1'}, selected: true},
          {legacy_descriptor: {legacy_id: '2'}, selected: false},
          {legacy_descriptor: {legacy_id: '3'}, selected: true},
        ],
      }
      const state = fromJS({contactForm})
      expect(getSelectedPeopleIdsSelector(state)).toEqualImmutable(
        fromJS([
          {legacy_descriptor: {legacy_id: '1'}},
          {legacy_descriptor: {legacy_id: '3'}},
        ])
      )
    })

    it('returns empty list when no people exist', () => {
      const contactForm = {}
      const state = fromJS({contactForm})
      expect(getSelectedPeopleIdsSelector(state)).toEqualImmutable(List())
    })
  })
})
