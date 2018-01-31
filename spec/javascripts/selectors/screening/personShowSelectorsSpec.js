import {fromJS, List} from 'immutable'
import {
  getFormattedPersonInformationSelector,
  getFormattedPersonWithErrorsSelector,
  getPersonFormattedPhoneNumbersSelector,
  getPersonFormattedAddressesSelector,
  getNamesRequiredSelector,
  getPersonAlertErrorMessageSelector,
  getErrorsSelector,
} from 'selectors/screening/personShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('personShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getFormattedPersonInformationSelector', () => {
    it('returns a blank person when person does not exist', () => {
      const participants = [{id: '1', date_of_birth: '2014-01-15'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '2')).toEqualImmutable(fromJS({
        legacySource: undefined,
        name: {value: 'Unknown Person', errors: [], required: false},
        gender: undefined,
        roles: {value: [], errors: []},
        languages: undefined,
        dateOfBirth: undefined,
        approximateAge: undefined,
        ssn: {value: '', errors: []},
        races: undefined,
        ethnicity: undefined,
        alertErrorMessage: undefined,
      }))
    })

    it('includes the legacy source for the given person', () => {
      const participants = [
        {id: '1', legacy_descriptor: {legacy_ui_id: '1-4', legacy_table_description: 'Client'}},
      ]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('legacySource'))
        .toEqual('Client ID 1-4 in CWS-CMS')
    })

    it('includes the display name for the given person', () => {
      const participants = [{id: '1', first_name: 'John', middle_name: 'Q', last_name: 'Public'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('name'))
        .toEqual(fromJS({
          value: 'John Q Public',
          errors: [],
          required: false,
        })
        )
    })

    it('includes the gender for the given person', () => {
      const participants = [{id: '1', gender: 'female'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('gender')).toEqual('Female')
    })

    it('includes the roles for the given person as is', () => {
      const participants = [{id: '1', roles: ['super-hero', 'anti-hero']}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').getIn(['roles', 'value']))
        .toEqualImmutable(fromJS(['super-hero', 'anti-hero']))
    })

    it('includes the formatted languages for the given person', () => {
      const participants = [{id: '1', languages: ['Javascript', 'Ruby']}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('languages'))
        .toEqual('Javascript (Primary), Ruby')
    })

    it('includes the formatted date of birth for the given person', () => {
      const participants = [{id: '1', date_of_birth: '2014-01-15'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('dateOfBirth')).toEqual('01/15/2014')
    })

    it('does not include approximate age if person has a date of birth', () => {
      const participants = [{
        id: '1',
        date_of_birth: '2014-01-15',
        approximate_age: '9', approximate_age_units: 'dog years',
      }]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('approximateAge')).toEqual(undefined)
    })

    it('includes the approximate age for the given person', () => {
      const participants = [{id: '1', approximate_age: '9', approximate_age_units: 'dog years'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('approximateAge')).toEqual('9 dog years')
    })

    it('includes the value and empty errors for the social security number for the given person', () => {
      const participants = [{id: '1', ssn: '987654321'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('ssn'))
        .toEqualImmutable(fromJS({
          value: '987-65-4321',
          errors: [],
        }))
    })

    it('includes the formatted races for the given person', () => {
      const participants = [
        {id: '1', races: [
          {race: 'White', race_detail: 'Romanian'},
          {race: 'Asian', race_detail: 'Chinese'},
          {race: 'Black or African American'},
        ]},
      ]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('races'))
        .toEqual('White - Romanian, Asian - Chinese, Black or African American')
    })

    it('includes the formatted ethnicity for a person of hispanic/latino origin who has ethnicity details', () => {
      const participants = [
        {id: '1', ethnicity: {hispanic_latino_origin: 'Yes', ethnicity_detail: ['Mexican']}},
      ]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('ethnicity')).toEqual('Yes - Mexican')
    })

    it('includes the formatted ethnicity for a person of hispanic/latino origin but without ethnicity details', () => {
      const participants = [
        {id: '1', ethnicity: {hispanic_latino_origin: 'Unknown', ethnicity_detail: []}},
      ]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('ethnicity')).toEqual('Unknown')
    })
  })

  describe('getFormattedPersonWithErrorsSelector', () => {
    it('includes errors for ssn', () => {
      const participants = [{id: '1', ssn: '987654321'}]
      const state = fromJS({participants})
      expect(getFormattedPersonWithErrorsSelector(state, '1').get('ssn'))
        .toEqualImmutable(fromJS({
          value: '987-65-4321',
          errors: ['Social security number cannot begin with 9.'],
        }))
    })

    it('includes errors and required value for name', () => {
      const participants = [{
        id: '1',
        first_name: null,
        middle_name: 'Q',
        last_name: 'Public',
        roles: ['Victim'],
      }]
      const state = fromJS({participants})
      expect(getFormattedPersonWithErrorsSelector(state, '1').get('name'))
        .toEqualImmutable(fromJS({
          value: '(Unknown first name) Q Public',
          errors: ['Please enter a first name.'],
          required: true,
        }))
    })
  })

  describe('getPersonFormattedPhoneNumbersSelector', () => {
    it('returns info for the person with the passed id', () => {
      const people = [
        {id: '1', phone_numbers: [{type: 'Home'}]},
        {id: '2', phone_numbers: [{type: 'Cell'}]},
      ]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1').first().get('type'))
        .toEqual('Home')
    })

    it('returns an empty array if no phone numbers exists for the person', () => {
      const people = [{id: '1'}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1')).toEqualImmutable(List())
    })

    it('returns a formatted phone number for number', () => {
      const people = [{id: '1', phone_numbers: [{number: '0123456789'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1').first().get('number'))
        .toEqual('(012)345-6789')
    })

    it('returns the type for a number', () => {
      const people = [{id: '1', phone_numbers: [{type: 'Home'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedPhoneNumbersSelector(state, '1').first().get('type'))
        .toEqual('Home')
    })
  })

  describe('getPersonFormattedAddressesSelector', () => {
    it('returns info for the person with the passed id', () => {
      const people = [
        {id: '1', addresses: [{type: 'Home'}]},
        {id: '2', addresses: [{type: 'Cell'}]},
      ]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('type'))
        .toEqual('Home')
    })

    it('returns an empty array if no addresses exists for the person', () => {
      const people = [{id: '1'}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1')).toEqualImmutable(List())
    })

    it('returns the street for an address', () => {
      const people = [{id: '1', addresses: [{street_address: '1234 Nowhere Lane'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('street'))
        .toEqual('1234 Nowhere Lane')
    })

    it('returns the city for an address', () => {
      const people = [{id: '1', addresses: [{city: 'Somewhereville'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('city'))
        .toEqual('Somewhereville')
    })

    it('returns the formatted state for an address', () => {
      const people = [{id: '1', addresses: [{state: 'CA'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('state'))
        .toEqual('California')
    })

    it('returns an empty string for an invalid state', () => {
      const people = [{id: '1', addresses: [{state: ''}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('state'))
        .toEqual('')
    })

    it('returns the zip for an address', () => {
      const people = [{id: '1', addresses: [{zip: '12345'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('zip'))
        .toEqual('12345')
    })

    it('returns the type for an address', () => {
      const people = [{id: '1', addresses: [{type: 'Home'}]}]
      const state = fromJS({participants: people})
      expect(getPersonFormattedAddressesSelector(state, '1').first().get('type'))
        .toEqual('Home')
    })
  })

  describe('getNamesRequiredSelector', () => {
    it('returns true if roles includes Victim', () => {
      const people = [{id: '1', roles: ['Victim', 'other role']}]
      const state = fromJS({participants: people})
      expect(getNamesRequiredSelector(state, '1')).toEqual(true)
    })

    it('returns true if roles includes Collateral', () => {
      const people = [{id: '1', roles: ['Collateral', 'other role']}]
      const state = fromJS({participants: people})
      expect(getNamesRequiredSelector(state, '1')).toEqual(true)
    })

    it('returns false if roles does not include Victim or Collateral', () => {
      const people = [{id: '1', roles: ['some role', 'other role']}]
      const state = fromJS({participants: people})
      expect(getNamesRequiredSelector(state, '1')).toEqual(false)
    })
  })

  describe('getPersonAlertErrorMessageSelector', () => {
    it('returns alert if roles include Victim and firstName is empty', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        last_name: 'Smith'}]
      const state = fromJS({participants: people})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(
        'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18')
    })

    it('returns alert if roles include Victim and lastName is empty', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        first_name: 'John'}]
      const state = fromJS({participants: people})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(
        'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18')
    })

    it('returns alert if roles include Collateral and firstName is empty', () => {
      const people = [{id: '1', roles: ['Collateral', 'other role'],
        last_name: 'Smith'}]
      const state = fromJS({participants: people})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(
        'Collateral must be identified with a name, even Doe or Unknown.')
    })

    it('returns alert if roles include Collateral and lastName is empty', () => {
      const people = [{id: '1', roles: ['Collateral', 'other role'],
        first_name: 'John'}]
      const state = fromJS({participants: people})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(
        'Collateral must be identified with a name, even Doe or Unknown.')
    })

    it('returns undefined if roles include Victim and lastName and firstName is not empty', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        first_name: 'John',
        last_name: 'Smoth'}]
      const state = fromJS({participants: people})
      expect(getPersonAlertErrorMessageSelector(state, '1')).toEqual(undefined)
    })
  })
  describe('getErrorsSelector', () => {
    describe('social security number', () => {
      it('must be 9 digits long', () => {
        const people = [{id: 'one', ssn: '88756123'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number must be 9 digits long.']))
      })

      it('does not count hyphens as part of the number length', () => {
        const people = [{id: 'one', ssn: '887-56-123'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number must be 9 digits long.']))
      })

      it('does not count underscores as part of the number length', () => {
        // our masked input adds underscores as part of the placeholder
        const people = [{id: 'one', ssn: '8__-__-____'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number must be 9 digits long.']))
      })

      it('cannot begin with 9.', () => {
        const people = [{id: 'one', ssn: '987561234'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot begin with 9.']))
      })

      it('cannot begin with 666.', () => {
        const people = [{id: 'one', ssn: '666561234'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot begin with 666.']))
      })

      it('cannot contain all 0s in the first group', () => {
        const people = [{id: 'one', ssn: '000-56-1234'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('cannot contain all 0s in second group', () => {
        const people = [{id: 'one', ssn: '768-00-1234'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('cannot contain all 0s in third group', () => {
        const people = [{id: 'one', ssn: '768-56-0000'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('only shows one error message related to all 0s in a group', () => {
        const people = [{id: 'one', ssn: '000-00-0000'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List(['Social security number cannot contain all 0s in a group.']))
      })

      it('can have multiple errors at the same time', () => {
        const people = [{id: 'one', ssn: '666-00-'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List([
            'Social security number must be 9 digits long.',
            'Social security number cannot begin with 666.',
            'Social security number cannot contain all 0s in a group.',
          ]))
      })

      it('does not return an error message for a valid number', () => {
        const people = [{id: 'one', ssn: '767561234'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List())
      })

      it('does not return an error message for a valid number that contains hyphens', () => {
        const people = [{id: 'one', ssn: '323-56-4321'}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List())
      })

      it('does not return an error message if the current value is null', () => {
        const people = [{id: 'one', ssn: null}]
        const state = fromJS({participants: people})
        expect(getErrorsSelector(state, 'one').get('ssn'))
          .toEqualImmutable(List())
      })
    })

    describe('roles in getErrorsSelector', () => {
      it('returns roles error if role includes Victim and date of birth or approximate age is empty', () => {
        const people = [{id: '1', roles: ['Victim']}]
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, participants: people})
        expect(getErrorsSelector(state, '1').get('roles').first()).toEqual('Alleged victims must be under 18 years old.')
      })

      it('does not return roles error if role includes Victim and date of birth is under 18', () => {
        const people = [{id: '1', date_of_birth: '12/24/2001', roles: ['Victim']}]
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, participants: people})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List())
      })

      it('does not return roles error if role includes Victim and date of birth is in the future', () => {
        const people = [{id: '1', date_of_birth: '2/24/2018', roles: ['Victim']}]
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, participants: people})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List())
      })

      it('returns roles error if role includes Victim and date of birth is over 18', () => {
        const people = [{id: '1', date_of_birth: '12/24/1998', roles: ['Victim']}]
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, participants: people})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
      })

      it('does not return roles error if role includes Victim and approximate age with units is under 18', () => {
        const people = [
          {id: '1', approximate_age: '17', approximate_age_units: 'years', roles: ['Victim']},
          {id: '2', approximate_age: '214', approximate_age_units: 'months', roles: ['Victim']},
          {id: '3', approximate_age: '923', approximate_age_units: 'weeks', roles: ['Victim']},
          {id: '4', approximate_age: '6522', approximate_age_units: 'days', roles: ['Victim']},
        ]
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, participants: people})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List([]))
        expect(getErrorsSelector(state, '2').get('roles')).toEqualImmutable(List([]))
        expect(getErrorsSelector(state, '3').get('roles')).toEqualImmutable(List([]))
        expect(getErrorsSelector(state, '4').get('roles')).toEqualImmutable(List([]))
      })

      it('returns roles error if role includes Victim and approximate age with units is under 18', () => {
        const people = [
          {id: '1', approximate_age: '18', approximate_age_units: 'years', roles: ['Victim']},
          {id: '2', approximate_age: '217', approximate_age_units: 'months', roles: ['Victim']},
          {id: '3', approximate_age: '940', approximate_age_units: 'weeks', roles: ['Victim']},
          {id: '4', approximate_age: '6575', approximate_age_units: 'days', roles: ['Victim']},
        ]
        const state = fromJS({screeningInformationForm: {started_at: {value: '2018-01-31T00:24:22.007Z'}}, participants: people})
        expect(getErrorsSelector(state, '1').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
        expect(getErrorsSelector(state, '2').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
        expect(getErrorsSelector(state, '3').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
        expect(getErrorsSelector(state, '4').get('roles')).toEqualImmutable(List(['Alleged victims must be under 18 years old.']))
      })
    })

    it('returns last name error if last name is empty and role includes Victim', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        first_name: 'John'}]
      const state = fromJS({participants: people})
      expect(getErrorsSelector(state, '1').get('name').first()).toEqual('Please enter a last name.')
    })

    it('returns first name error if first name is empty and role includes Victim', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        last_name: 'Smith'}]
      const state = fromJS({participants: people})
      expect(getErrorsSelector(state, '1').get('name').first()).toEqual('Please enter a first name.')
    })

    it('returns undefined if first name and last name is not empty and role includes Victim', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        last_name: 'Smith', first_name: 'John'}]
      const state = fromJS({participants: people})
      expect(getErrorsSelector(state, '1').get('name').first()).toEqual(undefined)
    })

    it('returns first name error and last name error if first name and last name are empty and role includes Victim', () => {
      const people = [{id: '1', roles: ['Victim', 'other role'],
        last_name: '', first_name: ''}]
      const state = fromJS({participants: people})
      expect(getErrorsSelector(state, '1').get('name').includes('Please enter a first name.')).toEqual(true)
      expect(getErrorsSelector(state, '1').get('name').includes('Please enter a last name.')).toEqual(true)
    })
  })
})
