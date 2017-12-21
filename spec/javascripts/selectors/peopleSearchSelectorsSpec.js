import * as matchers from 'jasmine-immutable-matchers'
import {fromJS, Map} from 'immutable'
import {
  getPeopleResultsSelector,
  getLastResultsSortValueSelector,
  getResultLanguagesSelector,
  getResultRacesSelector,
  getResultEthnicitiesSelector,
} from 'selectors/peopleSearchSelectors'

describe('peopleSearchSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

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

  describe('getResultLanguagesSelector', () => {
    const languageLovs = [
      {code: '1', value: 'English'},
      {code: '2', value: 'French'},
      {code: '3', value: 'Italian'},
    ]

    it('maps languages to lov values by id, sorting by primary', () => {
      const result = fromJS({
        languages: [
          {id: '3', primary: true},
          {id: '2', primary: false},
          {id: '1', primary: true}],
      })
      const state = fromJS({languages: languageLovs})
      const languageResult = getResultLanguagesSelector(state, result)
      expect(languageResult).toEqualImmutable(
        fromJS(['French', 'English', 'Italian'])
      )
    })
  })

  describe('getResultRacesSelector', () => {
    it('maps races to lov values by id', () => {
      const result = fromJS({
        race_ethnicity: {
          race_codes: [
            {id: '3', description: 'Romanian'},
            {id: '2', description: 'French'},
            {id: '1', description: 'European'},
          ],
        },
      })
      const state = fromJS({ethnicityTypes: ethnicityTypeLovs, raceTypes: raceTypeLovs})
      const racesResult = getResultRacesSelector(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS([
          {race: 'Race 3', race_detail: 'Romanian'},
          {race: 'Race 2', race_detail: 'French'},
          {race: 'Race 1', race_detail: 'European'},
        ])
      )
    })

    it('maps races to "Abandoned" if unableToDetermineCode is "A"', () => {
      const result = fromJS({
        unable_to_determine_code: 'A',
      })
      const state = fromJS({unableToDetermineCodes})

      const racesResult = getResultRacesSelector(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Abandoned'])
      )
    })

    it('maps races to "Unknown" if unableToDetermineCode is "I"', () => {
      const result = fromJS({
        unable_to_determine_code: 'I',
      })
      const state = fromJS({unableToDetermineCodes})

      const racesResult = getResultRacesSelector(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Unknown'])
      )
    })

    it('maps races to "Unknown" if unableToDetermineCode is "K"', () => {
      const result = fromJS({
        unable_to_determine_code: 'K',
      })
      const state = fromJS({unableToDetermineCodes})

      const racesResult = getResultRacesSelector(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Unknown'])
      )
    })
  })

  describe('getResultEthnicitiesSelector', () => {
    it('maps hispanic codes to lov values', () => {
      const result = fromJS({
        race_ethnicity: {
          hispanic_origin_code: 'Y',
          hispanic_codes: [
            {id: '3', description: 'Romanian'},
            {id: '2', description: 'French'},
            {id: '1', description: 'European'},
          ],
        },
      })
      const state = fromJS({hispanicOriginCodes, ethnicityTypes: ethnicityTypeLovs, raceTypes: raceTypeLovs})
      const racesResult = getResultEthnicitiesSelector(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS({
          hispanic_latino_origin: 'yes', ethnicity_detail: ['Romanian', 'French', 'European']}
        )
      )
    })
  })

  describe('getPeopleResultsSelector', () => {
    const languageLovs = [
      {code: '1', value: 'English'},
      {code: '2', value: 'French'},
      {code: '3', value: 'Italian'},
    ]

    it('maps person search attributes to suggestion attributes', () => {
      const peopleSearch = {
        results: [{
          first_name: 'Bart',
          last_name: 'Simpson',
          middle_name: 'Jacqueline',
          name_suffix: 'md',
          gender: 'female',
          languages: [{id: '3'}, {id: '2'}],
          races: [
            {race: 'White', race_detail: 'European'},
            {race: 'American Indian or Alaska Native'},
          ],
          ethnicity: {
            hispanic_latino_origin: 'Yes',
            ethnicity_detail: ['Central American'],
          },
          date_of_birth: '1990-02-13',
          ssn: '123456789',
          addresses: [{
            id: '1',
            street_address: '234 Fake Street',
            city: 'Flushing',
            state: 'NM',
            zip: '11344',
            type: 'School',
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
          sensitive: true,
          sealed: false,
        }],
      }
      const state = fromJS({languages: languageLovs, peopleSearch})
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults).toEqualImmutable(
        fromJS([{
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
            {race: 'White', race_detail: 'European'},
            {race: 'American Indian or Alaska Native'},
          ],
          ethnicity: {
            hispanic_latino_origin: 'Yes',
            ethnicity_detail: ['Central American'],
          },
          dateOfBirth: '1990-02-13',
          ssn: '123-45-6789',
          address: {
            city: 'Flushing',
            state: 'NM',
            streetAddress: '234 Fake Street',
            type: '',
            zip: '11344',
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
          addresses: [{
            id: '1',
            street_address: '234 Fake Street',
            city: 'Flushing',
            state: 'NM',
            zip: '11344',
            type: 'School',
          }, {
            id: '2',
            street_address: '2 Camden Crt',
            city: 'Flushing',
            state: 'NM',
            zip: '11222',
            type: 'Home',
          }],
          phone_numbers: [{
            number: '994-907-6774',
            type: 'Home',
          }, {
            number: '111-222-6774',
            type: 'Work',
          }],
        }],
      }
      const state = fromJS({peopleSearch})
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'address'])).toEqualImmutable(
        Map({
          streetAddress: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: '11344',
          type: '',
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
          phone_numbers: [],
          addresses: [],
        }],
      }
      const state = fromJS({peopleSearch})
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'address'])).toEqual(null)
      expect(peopleResults.getIn([0, 'phoneNumber'])).toEqual(null)
    })

    it('maps person search hightlight fields', () => {
      const peopleSearch = {
        results: [{
          first_name: 'Bart',
          last_name: 'Simpson',
          date_of_birth: '1990-02-13',
          ssn: '123456789',
          addresses: [],
          phone_numbers: [],
          highlight: {
            first_name: '<em>Bar</em>t',
            last_name: 'Sim<em>pson</em>',
            ssn: '<em>123456789</em>',
            date_of_birth: '<em>1990</em>-02-13',
          },
        }],
      }
      const state = fromJS({peopleSearch})
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'firstName'])).toEqual('<em>Bar</em>t')
      expect(peopleResults.getIn([0, 'lastName'])).toEqual('Sim<em>pson</em>')
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
      expect(peopleResults.getIn([0, 'dateOfBirth'])).toEqual('<em>1990</em>-02-13')
    })

    it('formats ssn', () => {
      const peopleSearch = {
        results: [{
          ssn: '123456789',
        }],
      }
      const state = fromJS({peopleSearch})
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('123-45-6789')
    })

    it('formats highlighted ssn', () => {
      const peopleSearch = {
        results: [{
          ssn: '123456789',
          highlight: {
            ssn: '<em>123456789</em>',
          },
        }],
      }
      const state = fromJS({peopleSearch})
      const peopleResults = getPeopleResultsSelector(state)
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
    })
  })
})

