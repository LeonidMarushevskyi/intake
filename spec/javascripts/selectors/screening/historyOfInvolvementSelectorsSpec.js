import {fromJS} from 'immutable'
import {
  getHistoryIsEmptySelector,
  getFormattedCasesSelector,
  getFormattedReferralsSelector,
  getFormattedScreeningsSelector,
} from 'selectors/screening/historyOfInvolvementSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('historyOfInvolvementSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const involvements = {cases: ['A'], referrals: ['B', 'C'], screenings: ['D', 'E', 'F']}

  describe('getHistoryIsEmptySelector', () => {
    it('returns true when history is not present', () => {
      const state = fromJS({involvements: {}})
      expect(getHistoryIsEmptySelector(state)).toEqual(true)
    })

    it('returns true when cases, referrals and screenings are empty', () => {
      const emptyHistory = {cases: [], referrals: [], screenings: []}
      const state = fromJS({involvements: {emptyHistory}})
      expect(getHistoryIsEmptySelector(state)).toEqual(true)
    })

    it('returns false when history items are present', () => {
      const state = fromJS({involvements})
      expect(getHistoryIsEmptySelector(state)).toEqual(false)
    })
  })

  describe('getFormattedCasesSelector', () => {
    it('returns the legacy_ui_id as caseId', () => {
      const cases = [{legacy_descriptor: {legacy_ui_id: 'ABC123'}}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'caseId'])).toEqual('ABC123')
    })

    it('returns the county_name as county', () => {
      const cases = [{county_name: 'Amador'}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'county'])).toEqual('Amador')
    })

    it('returns the start_date and end_date as a formatted date range', () => {
      const cases = [{start_date: '2002-01-02', end_date: '2002-02-03'}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'dateRange'])).toEqual('01/02/2002 - 02/03/2002')
    })

    it('returns the formatted name for the focus child', () => {
      const cases = [{focus_child: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'focusChild'])).toEqual('John Smith')
    })

    it('returns the formatted names for all parents present', () => {
      const cases = [{parents: [
        {first_name: 'John', last_name: 'Smith'},
        {first_name: 'Jane', last_name: 'Doe'},
      ]}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'parents'])).toEqual('John Smith, Jane Doe')
    })

    it('returns an empty string if no parents are present', () => {
      const cases = [{}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'parents'])).toEqual('')
    })

    it('returns Sealed if the access indicator is R', () => {
      const cases = [{access_limitation: {limited_access_code: 'R'}}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'restrictedAccessStatus'])).toEqual('Sealed')
    })

    it('returns undefined if no access indicator is present', () => {
      const cases = [{}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'restrictedAccessStatus'])).toEqual(undefined)
    })
    it('returns a status of "Closed" if there is an end date, but no service component', () => {
      const cases = [{end_date: '2003-01-01'}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'status'])).toEqual('Closed')
    })

    it('returns a status of "Open" if there is an end date present, but no service component', () => {
      const cases = [{}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'status'])).toEqual('Open')
    })

    it('adds the service component to the status if one exists', () => {
      const cases = [{end_date: '2003-01-01', service_component: 'Family reunification'}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'status'])).toEqual('Closed - Family reunification')
    })

    it('returns the formatted name for the worker', () => {
      const cases = [{assigned_social_worker: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'worker'])).toEqual('John Smith')
    })

    it('returns an empty string if no social worker is present', () => {
      const cases = [{assigned_social_worker: {}}]
      const state = fromJS({involvements: {cases}})
      expect(getFormattedCasesSelector(state).getIn([0, 'worker'])).toEqual('')
    })

    it('returns an empty map when history of involvement does not exist', () => {
      const state = fromJS({})
      expect(getFormattedCasesSelector(state)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getFormattedReferralsSelector', () => {
    it('returns a formatted date range', () => {
      const referrals = [{start_date: '2002-01-02', end_date: '2002-02-03'}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'dateRange'])).toEqual('01/02/2002 - 02/03/2002')
    })

    it('returns an ID for the given referral', () => {
      const referrals = [{legacy_descriptor: {legacy_ui_id: '1'}}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'referralId'])).toEqual('1')
    })

    it('returns a status of open for the given referral when there is no close date', () => {
      const referrals = [{}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'status'])).toEqual('Open')
    })

    it('returns a status of closed for the given referral when there is a close date', () => {
      const referrals = [{end_date: '2009-02-03'}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'status'])).toEqual('Closed')
    })

    it('includes the response time for a given referral in the status, if present', () => {
      const referrals = [{response_time: 'Immediate'}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'status'])).toEqual('Open - Immediate')
    })

    it('returns a restrictedAccessStatus if one is present', () => {
      const referrals = [{access_limitation: {limited_access_code: 'R'}}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'notification'])).toEqual('Sealed')
    })

    it('returns the county name', () => {
      const referrals = [{county_name: 'Yolo'}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'county'])).toEqual('Yolo')
    })

    it('returns a formatted name for the worker', () => {
      const referrals = [{assigned_social_worker: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'worker'])).toEqual('John Smith')
    })

    it('returns an empty string if the worker does not exist', () => {
      const referrals = [{}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'worker'])).toEqual('')
    })

    it('returns a formatted name for the reporter', () => {
      const referrals = [{reporter: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'reporter'])).toEqual('John Smith')
    })

    it('returns an empty string if the reporter does not exist', () => {
      const referrals = [{}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'reporter'])).toEqual('')
    })

    it('returns an object that includes a victim, a perpetrator, allegations, and a disposition', () => {
      const referrals = [{
        allegations: [{
          victim_last_name: 'W.',
          victim_first_name: 'Sharon',
          perpetrator_last_name: 'W.',
          perpetrator_first_name: 'Ricky',
          disposition_description: 'Substantiated',
          allegation_description: 'Sexual Abuse',
        }],
      }]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'peopleAndRoles']))
        .toEqualImmutable(fromJS([{
          victim: 'Sharon W.',
          perpetrator: 'Ricky W.',
          allegations: 'Sexual Abuse',
          disposition: '(Substantiated)',
        }]))
    })

    it('returns an object with empty strings when victim and perpetrator are empty', () => {
      const referrals = [{allegations: [{victim: {}, perpetrator: {}}]}]
      const state = fromJS({involvements: {referrals}})
      expect(getFormattedReferralsSelector(state).getIn([0, 'peopleAndRoles']))
        .toEqualImmutable(fromJS([{
          victim: '',
          perpetrator: '',
          allegations: '',
          disposition: '',
        }]))
    })

    it('returns an empty list when history of involvement does not exist', () => {
      const state = fromJS({})
      expect(getFormattedReferralsSelector(state)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getFormattedScreeningsSelector', () => {
    it('returns names of people who do not have reporter as their only role', () => {
      const screenings = [
        {all_people: [{first_name: 'John', last_name: 'Smith', roles: ['Victim', 'Anonymous Reporter']}]},
      ]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'people']))
        .toEqual('John Smith')
    })

    it('returns names of people who have no roles', () => {
      const screenings = [
        {all_people: [{first_name: 'John', last_name: 'Smith', roles: []}]},
      ]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'people']))
        .toEqual('John Smith')
    })

    it('joins names of multiple people into a comma-separated list', () => {
      const screenings = [
        {all_people: [
          {first_name: 'John', last_name: 'Smith', roles: []},
          {first_name: 'Jane', last_name: 'Doe', roles: []},
        ]},
      ]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'people']))
        .toEqual('John Smith, Jane Doe')
    })

    it('does not return names of people who only have a role of reporter', () => {
      const screenings = [
        {all_people: [{first_name: 'John', last_name: 'Smith', roles: ['Mandated Reporter']}]},
      ]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'people']))
        .toEqual('')
    })

    it('returns an empty string for people if no people are present', () => {
      const screenings = [
        {all_people: []},
      ]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'people'])).toEqual('')
    })

    it('returns an empty string if the reporter is an empty object', () => {
      const screenings = [{reporter: {}}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'reporter'])).toEqual('')
    })

    it('returns a formatted name for the reporter when one is present', () => {
      const screenings = [{reporter: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'reporter'])).toEqual('John Smith')
    })

    it('returns the enum mapped value for the county', () => {
      const screenings = [{county_name: 'amador'}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'county'])).toEqual('Amador')
    })

    it('returns an empty string when county is empty', () => {
      const screenings = [{}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'county'])).toEqual('')
    })

    it('returns the start_date and end_date as a formatted date range', () => {
      const screenings = [{start_date: '2002-01-02', end_date: '2002-02-03'}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'dateRange'])).toEqual('01/02/2002 - 02/03/2002')
    })

    it('returns the last name for the worker when present', () => {
      const screenings = [{assigned_social_worker: {last_name: 'John Smith'}}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'worker'])).toEqual('John Smith')
    })

    it('returns an empty string when the worker is not present', () => {
      const screenings = [{}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'worker'])).toEqual('')
    })

    it('Returns a status of Closed if there is an end_date', () => {
      const screenings = [{end_date: '2009-01-02'}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'status'])).toEqual('Closed')
    })

    it('Returns a status of In Progress if there is no end_date', () => {
      const screenings = [{}]
      const state = fromJS({involvements: {screenings}})
      expect(getFormattedScreeningsSelector(state).getIn([0, 'status'])).toEqual('In Progress')
    })

    it('returns an empty map when history of involvement does not exist', () => {
      const state = fromJS({})
      expect(getFormattedScreeningsSelector(state)).toEqualImmutable(fromJS([]))
    })
  })
})
