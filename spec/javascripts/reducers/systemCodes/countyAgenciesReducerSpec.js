import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import countyAgenciesReducer from 'reducers/systemCodes/countyAgenciesReducer'
import {fetchSuccess} from 'actions/countyAgenciesActions'

describe('countyAgenciesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_COUNTY_AGENCIES_SUCCESS', () => {
    it('returns the system codes for county agencies', () => {
      const action = fetchSuccess([
        {
          id: 'PaV1yNy00E',
          name: "Daisie's Preschool",
          type: 'COMMUNITY_CARE_LICENSING',
          county_id: '1086',
        },
        {
          id: 'K2Eh2w575C',
          name: 'FBI',
          type: 'DEPARTMENT_OF_JUSTICE',
          county_id: '1086',
        },
        {
          id: '4fECsXh75C',
          name: 'DA of LA',
          type: 'DISTRICT_ATTORNEY',
          county_id: '1086',
        },
        {
          id: 'GPumYGQ00F',
          name: 'Hovernment Agency',
          type: 'COUNTY_LICENSING',
          county_id: '1086',
        },
        {
          id: 'BMG2f3J75C',
          name: 'The Sheriff',
          type: 'LAW_ENFORCEMENT',
          county_id: '1086',
        },
      ])
      expect(countyAgenciesReducer(List(), action)).toEqualImmutable(fromJS(
        [
          {
            id: 'PaV1yNy00E',
            name: "Daisie's Preschool",
            type: 'COMMUNITY_CARE_LICENSING',
            county_id: '1086',
          },
          {
            id: 'K2Eh2w575C',
            name: 'FBI',
            type: 'DEPARTMENT_OF_JUSTICE',
            county_id: '1086',
          },
          {
            id: '4fECsXh75C',
            name: 'DA of LA',
            type: 'DISTRICT_ATTORNEY',
            county_id: '1086',
          },
          {
            id: 'GPumYGQ00F',
            name: 'Hovernment Agency',
            type: 'COUNTY_LICENSING',
            county_id: '1086',
          },
          {
            id: 'BMG2f3J75C',
            name: 'The Sheriff',
            type: 'LAW_ENFORCEMENT',
            county_id: '1086',
          },
        ]
      ))
    })
  })
})
