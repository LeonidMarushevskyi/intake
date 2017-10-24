import {fromJS, Map, List} from 'immutable'
import {
  getReferralsSelector,
  getReferralAtIndexSelector,
  getStartDateSelector,
  getEndDateSelector,
  getReferralIdSelector,
  getStatusSelector,
  getResponseTimeSelector,
  getNotificationSelector,
  getCountySelector,
  getPeopleAndRolesSelector,
} from 'selectors/historyOfInvolvementReferralSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('historyOfInvolvementReferralSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const emptyInvestigation = {
    investigation: {
      history_of_involvement: {
        referrals: [{
          allegations: [{}],
        }],
      },
    },
  }
  const emptyState = fromJS(emptyInvestigation)

  describe('getReferralsSelector', () => {
    it('returns a list of referrals', () => {
      const referrals = [
        {start_date: '1/2/2009'},
        {start_date: '2/3/2009'},
      ]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getReferralsSelector(state)).toEqualImmutable(fromJS(referrals))
    })

    it('returns an empty list when there are no referrals', () => {
      const referrals = []
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getReferralsSelector(state)).toEqualImmutable(List())
    })
  })

  describe('getReferralAtIndexSelector', () => {
    it('returns a referral at the given index or an empty object if there is no referral', () => {
      const referrals = [
        {start_date: '1/2/2009'},
        {start_date: '2/3/2009'},
      ]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getReferralAtIndexSelector(state, 0)).toEqualImmutable(Map({start_date: '1/2/2009'}))
      expect(getReferralAtIndexSelector(state, 1)).toEqualImmutable(Map({start_date: '2/3/2009'}))
      expect(getReferralAtIndexSelector(state, 2)).toEqualImmutable(Map())
    })
  })

  describe('getStartDateSelector', () => {
    it('returns a start date for the given referral or empty string if none is present', () => {
      const referrals = [{start_date: '1/2/2009'}]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getStartDateSelector(state, 0)).toEqual('1/2/2009')
      expect(getStartDateSelector(emptyState, 0)).toEqual('')
    })
  })

  describe('getEndDateSelector', () => {
    it('returns a start date for the given referral or empty string if none is present', () => {
      const referrals = [{end_date: '1/2/2009'}]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getEndDateSelector(state, 0)).toEqual('1/2/2009')
      expect(getEndDateSelector(emptyState, 0)).toEqual('')
    })
  })

  describe('getReferralIdSelector', () => {
    it('returns an ID for the given referral or empty string if none is present', () => {
      const referrals = [{
        legacy_descriptor: {
          legacy_ui_id: '1',
        },
      }]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getReferralIdSelector(state, 0)).toEqual('1')
      expect(getReferralIdSelector(emptyState, 0)).toEqual('')
    })
  })

  describe('getStatusSelector', () => {
    it('returns a status of open for the given referral when there is no close date', () => {
      const referrals = [{
      }]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getStatusSelector(state, 0)).toEqual('Open')
    })

    it('returns a status of closed for the given referral when there is a close date', () => {
      const referrals = [{
        end_date: '1/2/2009',
      }]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getStatusSelector(state, 0)).toEqual('Closed')
    })
  })

  describe('getResponseTimeSelector', () => {
    it('returns a response time for the given referral or an empty string if it doesnt exist', () => {
      const referrals = [
        {response_time: '12:01AM'},
      ]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getResponseTimeSelector(state, 0)).toEqual('12:01AM')
      expect(getResponseTimeSelector(emptyState, 0)).toEqual('')
    })
  })

  describe('getNotificationSelector', () => {
    it('returns a notification for the given referral based on the access code', () => {
      const referrals = [
        {
          access_limitation: {
            limited_access_code: 'R',
          },
        },
        {
          access_limitation: {
            limited_access_code: 'S',
          },
        },
        {
          access_limitation: {
            limited_access_code: 'TOTALY NOT OKAY',
          },
        },
      ]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getNotificationSelector(state, 0)).toEqual('Sealed')
      expect(getNotificationSelector(state, 1)).toEqual('Sensitive')
      expect(getNotificationSelector(state, 2)).toEqual(undefined)
    })
  })

  describe('getCountySelector', () => {
    it('returns the county name or empty string if it doesnt exist', () => {
      const referrals = [
        {county_name: 'Yolo'},
      ]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getCountySelector(state, 0)).toEqual('Yolo')
      expect(getCountySelector(emptyState, 0)).toEqual('')
    })
  })

  describe('getPeopleAndRolesSelector', () => {
    it('returns an object that includes a victim, a perpetrator, allegations, and a disposition', () => {
      const referrals = [
        {
          allegations: [{
            victim_last_name: 'W.',
            victim_first_name: 'Sharon',
            perpetrator_last_name: 'W.',
            perpetrator_first_name: 'Ricky',
            disposition_description: 'Substantiated',
            allegation_description: 'Sexual Abuse',
          }],
        },
      ]
      const investigation = {
        history_of_involvement: {referrals},
      }
      const state = fromJS({investigation})
      expect(getPeopleAndRolesSelector(state, 0)).toEqualImmutable(fromJS([{
        victim: 'Sharon W.',
        perpetrator: 'Ricky W.',
        allegations: 'Sexual Abuse',
        disposition: 'Substantiated',
      }]))
    })

    it('returns an object with empty strings when allegations are empty', () => {
      expect(getPeopleAndRolesSelector(emptyState, 0)).toEqualImmutable(fromJS([{
        victim: '',
        perpetrator: '',
        allegations: '',
        disposition: '',
      }]))
    })
  })
})
