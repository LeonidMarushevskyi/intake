import {fromJS} from 'immutable'
import {getFormattedPersonInformationSelector} from 'selectors/screening/peopleShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('peopleShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getFormattedPersonInformationSelector', () => {
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
    it('includes the formatted ethnicity for the given person', () => {
      const participants = [
        {id: '1', ethnicity: {hispanic_latino_origin: 'Yes', ethnicity_detail: ['Mexican']}},
      ]
      const state = fromJS({participants})
      expect(getFormattedPersonInformationSelector(state, '1').get('ethnicity')).toEqual('Yes - Mexican')
    })
  })
})