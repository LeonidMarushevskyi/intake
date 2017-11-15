import {fromJS, List} from 'immutable'
import {
  getFormattedPersonInformationSelector,
  getPersonFormattedPhoneNumbersSelector,
  getPersonFormattedAddressesSelector,
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
        name: 'Unknown Person',
        gender: undefined,
        roles: [],
        languages: undefined,
        dateOfBirth: undefined,
        approximateAge: undefined,
        ssn: undefined,
        races: undefined,
        ethnicity: undefined,
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
        .toEqual('John Q Public')
    })
    it('includes the gender for the given person', () => {
      const participants = [{id: '1', gender: 'female'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('gender')).toEqual('Female')
    })
    it('includes the roles for the given person as is', () => {
      const participants = [{id: '1', roles: ['super-hero', 'anti-hero']}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('roles'))
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
    it('includes the formatted social security number for the given person', () => {
      const participants = [{id: '1', ssn: '123456789'}]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('ssn')).toEqual('123-45-6789')
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
})
