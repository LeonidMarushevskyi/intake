import {List, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import countyAgenciesReducer from 'reducers/systemCodes/countyAgenciesReducer'
import {fetchSuccess, fetchFailure} from 'actions/countyAgenciesActions'

describe('countyAgenciesReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_COUNTY_AGENCIES_COMPLETE', () => {
    it('returns the system codes for county agencies on success', () => {
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

    it('returns the last state on failure', () => {
      const action = fetchFailure()
      expect(countyAgenciesReducer(List(), action))
        .toEqualImmutable(List())
    })
  })
})
