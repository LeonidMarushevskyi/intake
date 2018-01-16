import * as matchers from 'jasmine-immutable-matchers'
import {fromJS} from 'immutable'
import {
  mapLanguages,
  mapRaces,
  mapEthnicities,
  mapIsSensitive,
  mapIsSealed,
  mapAddress,
} from 'utils/peopleSearchHelper'

describe('peopleSearchHelper', () => {
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

  const addressTypes = [
    {code: '1', value: 'address type'},
  ]

  describe('mapLanguages', () => {
    it('maps languages to lov values by id, sorting by primary', () => {
      const result = fromJS({
        languages: [
          {id: '3', primary: true},
          {id: '2', primary: false},
          {id: '1', primary: true}],
      })
      const state = fromJS({languages: languageLovs})
      const languageResult = mapLanguages(state, result)
      expect(languageResult).toEqualImmutable(
        fromJS(['French', 'English', 'Italian'])
      )
    })
  })

  describe('mapIsSensitive', () => {
    it('returns true if the result is sensitive', () => {
      const result = fromJS({
        sensitivity_indicator: 'S',
      })
      const sensitiveResult = mapIsSensitive(result)
      expect(sensitiveResult).toEqual(true)
    })

    it('returns false if the result is not sensitive', () => {
      const result = fromJS({
        sensitivity_indicator: 'R',
      })
      const sensitiveResult = mapIsSensitive(result)
      expect(sensitiveResult).toEqual(false)
    })
  })

  describe('mapIsSealed', () => {
    it('returns true if the result is sealed', () => {
      const result = fromJS({
        sensitivity_indicator: 'R',
      })
      const sensitiveResult = mapIsSealed(result)
      expect(sensitiveResult).toEqual(true)
    })

    it('returns false if the result is not sealed', () => {
      const result = fromJS({
        sensitivity_indicator: 'S',
      })
      const sensitiveResult = mapIsSealed(result)
      expect(sensitiveResult).toEqual(false)
    })
  })

  describe('mapAddress', () => {
    it('returns the city, state, zip, type, and a joined street address', () => {
      const result = fromJS({
        addresses: [{
          city: 'city',
          state_code: 'state',
          zip: 'zip',
          type: {id: '1'},
          street_number: '123',
          street_name: 'C Street',

        }],
      })
      const state = fromJS({addressTypes})
      const addressResult = mapAddress(state, result)
      expect(addressResult).toEqualImmutable(fromJS({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: 'address type',
        streetAddress: '123 C Street',
      }))
    })

    it('returns city state, zip, a joined street address, and empty string when type is undefined', () => {
      const result = fromJS({
        addresses: [{
          city: 'city',
          state_code: 'state',
          zip: 'zip',
          type: {id: 'not a value to be found'},
          street_number: '123',
          street_name: 'C Street',

        }],
      })
      const state = fromJS({addressTypes})
      const addressResult = mapAddress(state, result)
      expect(addressResult).toEqualImmutable(fromJS({
        city: 'city',
        state: 'state',
        zip: 'zip',
        type: '',
        streetAddress: '123 C Street',
      }))
    })
  })

  describe('mapRaces', () => {
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
      const racesResult = mapRaces(state, result)
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

      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Abandoned'])
      )
    })

    it('maps races to "Unknown" if unableToDetermineCode is "I"', () => {
      const result = fromJS({
        unable_to_determine_code: 'I',
      })
      const state = fromJS({unableToDetermineCodes})

      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Unknown'])
      )
    })

    it('maps races to "Unknown" if unableToDetermineCode is "K"', () => {
      const result = fromJS({
        unable_to_determine_code: 'K',
      })
      const state = fromJS({unableToDetermineCodes})

      const racesResult = mapRaces(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS(['Unknown'])
      )
    })
  })

  describe('mapEthnicities', () => {
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
      const racesResult = mapEthnicities(state, result)
      expect(racesResult).toEqualImmutable(
        fromJS({
          hispanic_latino_origin: 'yes', ethnicity_detail: ['Romanian', 'French', 'European']}
        )
      )
    })
  })
})
