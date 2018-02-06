import * as matchers from 'jasmine-immutable-matchers'
import {fromJS, Map} from 'immutable'
import {
  getPeopleResultsSelector,
  getLastResultsSortValueSelector,
} from 'selectors/peopleSearchSelectors'

describe('peopleSearchSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const languageLovs = [
    {code: '1', value: 'English'},
    {code: '2', value: 'French'},
    {code: '3', value: 'Italian'},
  ]
  const ethnicityTypeLovs = [
    {code: '1', value: 'European'},
    {code: '2', value: 'French'},
    {code: '3', value: 'Romanian'},
  ]
  const raceTypeLovs = [
    {code: '1', value: 'Race 1'},
    {code: '2', value: 'Race 2'},
    {code: '3', value: 'Race 3'},
  ]
  const unableToDetermineCodes = [
    {code: 'A', value: 'Abandoned'},
    {code: 'I', value: 'Unknown'},
    {code: 'K', value: 'Unknown'},
  ]
  const hispanicOriginCodes = [
    {code: 'Y', value: 'yes'},
    {code: 'N', value: 'no'},
  ]
  const usStates = [
    {code: '1', value: 'state'},
  ]

  const addressTypes = [
    {code: '1', value: 'address type'},
  ]

  describe('getLastResultsSortValueSelector', () => {
    it('returns the last results sort attribute', () => {
      const peopleSearch = {
        results: [{
          sort: ['first_sort'],
        }, {
          sort: ['other_sort'],
        }, {
          sort: ['last_sort'],
        }],
      }
      const state = fromJS({peopleSearch})
      const lastSort = getLastResultsSortValueSelector(state)
      expect(lastSort).toEqual(['last_sort'])
    })
  })

  describe('getPeopleResultsSelector', () => {
    it('maps person search attributes to suggestion attributes', () => {
      const peopleSearch = {
        results: [{
          _source: {
            id: '1',
            first_name: 'Bart',
            last_name: 'Simpson',
            middle_name: 'Jacqueline',
            name_suffix: 'md',
            gender: 'female',
            languages: [{id: '3'}, {id: '2'}],
            race_ethnicity: {
              hispanic_origin_code: 'Y',
              hispanic_unable_to_determine_code: 'Y',
              race_codes: [{id: '1'}],
              hispanic_codes: [{description: 'Central American'}],
            },
            date_of_birth: '1990-02-13',
            ssn: '123456789',
            addresses: [{
              id: '1',
              street_number: '234',
              street_name: 'Fake Street',
              city: 'Flushing',
              state_code: 'state',
              zip: '11344',
              type: {id: '1'},
            }],
            phone_numbers: [{
              id: '2',
              number: '994-907-6774',
              type: 'Home',
            }],
            legacy_descriptor: {
              legacy_ui_id: '123-456-789',
              legacy_table_description: 'Client',
            },
            sensitivity_indicator: 'S',
          },
        }],
      }
      const state = fromJS({
        languages: languageLovs,
        ethnicityTypes: ethnicityTypeLovs,
        raceTypes: raceTypeLovs,
        unableToDetermineCodes,
        hispanicOriginCodes,
        usStates,
        peopleSearch,
        addressTypes,
      })
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults).toEqualImmutable(
        fromJS([{
          legacy_id: '1',
          firstName: 'Bart',
          lastName: 'Simpson',
          middleName: 'Jacqueline',
          nameSuffix: 'md',
          gender: 'female',
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: [
            {race: 'Race 1', race_detail: 'European'},
          ],
          ethnicity: {
            hispanic_latino_origin: 'yes',
            ethnicity_detail: ['Central American'],
          },
          dateOfBirth: '1990-02-13',
          ssn: '123-45-6789',
          address: {
            city: 'Flushing',
            state: 'state',
            zip: '11344',
            type: 'address type',
            streetAddress: '234 Fake Street',
          },
          phoneNumber: {
            number: '994-907-6774',
            type: 'Home',
          },
          isSensitive: true,
          isSealed: false,
        }])
      )
    })

    it('maps the first address and phone number result to address and phone number', () => {
      const peopleSearch = {
        results: [{
          _source: {
            addresses: [{
              id: '1',
              street_number: '234',
              street_name: 'Fake Street',
              city: 'Flushing',
              state_code: 'state',
              zip: '11344',
              type: {id: '1'},
            }, {
              id: '2',
              street_number: '2',
              street_name: 'Camden Crt',
              city: 'Flushing',
              state_code: 'state',
              zip: '11222',
              type: {id: '1'},
            }],
            phone_numbers: [{
              number: '994-907-6774',
              type: 'Home',
            }, {
              number: '111-222-6774',
              type: 'Work',
            }],
          },
        }],
      }
      const state = fromJS({
        languages: languageLovs,
        ethnicityTypes: ethnicityTypeLovs,
        raceTypes: raceTypeLovs,
        unableToDetermineCodes,
        hispanicOriginCodes,
        usStates,
        peopleSearch,
        addressTypes,
      })
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'address'])).toEqualImmutable(
        Map({
          city: 'Flushing',
          state: 'state',
          zip: '11344',
          type: 'address type',
          streetAddress: '234 Fake Street',
        })
      )
      expect(peopleResults.getIn([0, 'phoneNumber'])).toEqualImmutable(
        Map({
          number: '994-907-6774',
          type: 'Home',
        })
      )
    })

    it('maps person search attributes when phone numbers and addresses are empty', () => {
      const peopleSearch = {
        results: [{
          _source: {
            phone_numbers: [],
            addresses: [],
          },
        }],
      }
      const state = fromJS({
        languages: languageLovs,
        ethnicityTypes: ethnicityTypeLovs,
        raceTypes: raceTypeLovs,
        unableToDetermineCodes,
        hispanicOriginCodes,
        usStates,
        peopleSearch,
        addressTypes,
      })
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'address'])).toEqual(null)
      expect(peopleResults.getIn([0, 'phoneNumber'])).toEqual(null)
    })

    it('maps person search hightlight fields', () => {
      const peopleSearch = {
        results: [{
          _source: {
            first_name: 'Bart',
            last_name: 'Simpson',
            date_of_birth: '1990-02-13',
            ssn: '123456789',
            addresses: [],
            phone_numbers: [],
          },
          highlight: {
            first_name: ['<em>Bar</em>t'],
            last_name: ['Sim<em>pson</em>'],
            ssn: ['<em>123456789</em>'],
            searchable_date_of_birth: ['<em>1990</em>'],
          },
        }],
      }
      const state = fromJS({
        languages: languageLovs,
        ethnicityTypes: ethnicityTypeLovs,
        raceTypes: raceTypeLovs,
        unableToDetermineCodes,
        hispanicOriginCodes,
        usStates,
        peopleSearch,
        addressTypes,
      })
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'firstName'])).toEqual('<em>Bar</em>t')
      expect(peopleResults.getIn([0, 'lastName'])).toEqual('Sim<em>pson</em>')
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
      expect(peopleResults.getIn([0, 'dateOfBirth'])).toEqual('<em>1990-02-13</em>')
    })

    it('formats ssn', () => {
      const peopleSearch = {
        results: [{
          _source: {
            ssn: '123456789',
          },
        }],
      }
      const state = fromJS({
        languages: languageLovs,
        ethnicityTypes: ethnicityTypeLovs,
        raceTypes: raceTypeLovs,
        unableToDetermineCodes,
        hispanicOriginCodes,
        usStates,
        peopleSearch,
        addressTypes,
      })
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('123-45-6789')
    })

    it('formats highlighted ssn', () => {
      const peopleSearch = {
        results: [{
          _source: {
            ssn: '123456789',
          },
          highlight: {
            ssn: ['<em>123456789</em>'],
          },
        }],
      }
      const state = fromJS({
        languages: languageLovs,
        ethnicityTypes: ethnicityTypeLovs,
        raceTypes: raceTypeLovs,
        unableToDetermineCodes,
        hispanicOriginCodes,
        usStates,
        peopleSearch,
        addressTypes,
      })
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
    })
  })
})

