import {fromJS, Map, List} from 'immutable'
import {
  getScreeningsSelector,
  getScreeningAtIndexSelector,
  getPeopleNamesSelector,
  getReporterNameSelector,
  getWorkerNameSelector,
  getCountyNameSelector,
  getStatusSelector,
  getPeopleWhoAreNotJustReportersSelector,
} from 'selectors/historyOfInvolvementScreeningSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('historyOfInvolvementScreeningSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getScreeningsSelector', () => {
    it('returns the screenings when present', () => {
      const screenings = [{id: 1}, {id: 2}, {id: 3}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getScreeningsSelector(state, 1)).toEqualImmutable(fromJS(screenings))
    })

    it('returns an empty List when there are no screenings', () => {
      const state = fromJS({investigation: {history_of_involvement: {referrals: []}}})
      expect(getScreeningsSelector(state, 1)).toEqualImmutable(List())
    })
  })

  describe('getScreeningAtIndexSelector', () => {
    it('returns the screening at the passed index when present', () => {
      const screenings = [{id: 1}, {id: 2}, {id: 3}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getScreeningAtIndexSelector(state, 1)).toEqualImmutable(Map({id: 2}))
    })

    it('returns an empty Map when there is no item at the passed index', () => {
      const screenings = [{id: 1}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getScreeningAtIndexSelector(state, 1)).toEqualImmutable(Map())
    })
  })

  describe('getPeopleWhoAreNotJustReportersSelector', () => {
    it('returns people who do not have reporter as their only role', () => {
      const screenings = [
        {all_people: [{name: 'Bob', roles: ['Victim', 'Anonymous Reporter']}]},
      ]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getPeopleWhoAreNotJustReportersSelector(state, 0))
        .toEqualImmutable(fromJS([{name: 'Bob', roles: ['Victim', 'Anonymous Reporter']}]))
    })

    it('returns people who have no roles', () => {
      const screenings = [
        {all_people: [{name: 'Bob', roles: []}]},
      ]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getPeopleWhoAreNotJustReportersSelector(state, 0))
        .toEqualImmutable(fromJS([{name: 'Bob', roles: []}]))
    })

    it('does not return people who only have a role of reporter', () => {
      const screenings = [
        {all_people: [{name: 'Bob', roles: ['Mandated Reporter']}]},
      ]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getPeopleWhoAreNotJustReportersSelector(state, 0))
        .toEqualImmutable(fromJS([]))
    })
  })

  describe('getPeopleNamesSelector', () => {
    it('returns people from the proper screening with formatted names', () => {
      const screenings = [
        {all_people: [
          {first_name: 'John', last_name: 'Smith', roles: []},
          {first_name: 'Homer', last_name: 'Simpson', roles: []},
        ]},
        {all_people: [
          {first_name: 'Jane', last_name: 'Doe'},
        ]},
      ]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getPeopleNamesSelector(state, 0)).toEqual('John Smith, Homer Simpson')
    })

    it('returns an empty string if no people are present', () => {
      const screenings = [
        {all_people: []},
        {all_people: [{first_name: 'Jane', last_name: 'Doe'}]},
      ]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getPeopleNamesSelector(state, 0)).toEqual('')
    })

    it('returns an empty string if people is undefined', () => {
      const screenings = [
        {},
        {all_people: [{first_name: 'Jane', last_name: 'Doe'}]},
      ]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getPeopleNamesSelector(state, 0)).toEqual('')
    })
  })

  describe('getReporterNameSelector', () => {
    it('returns an empty string in the reporter is an empty object', () => {
      const screenings = [{reporter: {}}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getReporterNameSelector(state, 0)).toEqual('')
    })

    it('returns a formatted name for the reporter when one is present', () => {
      const screenings = [{reporter: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getReporterNameSelector(state, 0)).toEqual('John Smith')
    })
  })

  describe('getCountyNameSelector', () => {
    it('returns the enum mapped value for the county', () => {
      const screenings = [{county_name: 'amador'}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getCountyNameSelector(state, 0)).toEqual('Amador')
    })

    it('returns an empty string when county is empty', () => {
      const screenings = [{}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getCountyNameSelector(state, 0)).toEqual('')
    })
  })

  describe('getWorkerNameSelector', () => {
    it('returns the last name for the worker when present', () => {
      const screenings = [{assigned_social_worker: {last_name: 'John Smith'}}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getWorkerNameSelector(state, 0)).toEqual('John Smith')
    })

    it('returns an empty string when the worker is not present', () => {
      const screenings = [{}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getWorkerNameSelector(state, 0)).toEqual('')
    })
  })

  describe('getStatusSelector', () => {
    it('Returns Closed if there is an end_date', () => {
      const screenings = [{end_date: '2009-01-02'}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getStatusSelector(state, 0)).toEqual('Closed')
    })

    it('Returns In Progress if there is no end_date', () => {
      const screenings = [{}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getStatusSelector(state, 0)).toEqual('In Progress')
    })

    it('Returns In Progress if the end date is an empty string', () => {
      const screenings = [{end_date: ''}]
      const state = fromJS({investigation: {history_of_involvement: {screenings}}})
      expect(getStatusSelector(state, 0)).toEqual('In Progress')
    })
  })
})
