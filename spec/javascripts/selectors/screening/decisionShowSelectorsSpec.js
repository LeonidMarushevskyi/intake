import {fromJS, List} from 'immutable'
import {
  getDecisionSelector,
  getDecisionDetailSelector,
} from 'selectors/screening/decisionShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('allegationShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getDecisionSelector', () => {
    it('returns the human-readable value of the screening decision', () => {
      const screening = {screening_decision: 'promote_to_referral'}
      const state = fromJS({screening})
      expect(getDecisionSelector(state).get('value')).toEqual('Promote to referral')
    })

    it('returns errors for screening decision', () => {
      const screening = {screening_decision: 'promote_to_referral'}
      const state = fromJS({screening})
      expect(getDecisionSelector(state).get('errors')).toEqualImmutable(List())
    })
  })

  describe('getDecisionDetailSelector', () => {
    it('returns the value for decision detail as a raw value', () => {
      const screening = {
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '3_days',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('value')).toEqual('3 days')
    })

    it('returns the human-readable value for decision detail as an enum', () => {
      const screening = {
        screening_decision: 'differential_response',
        screening_decision_detail: 'Provide info on service',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('value')).toEqual('Provide info on service')
    })

    it('returns errors for decision detail', () => {
      const screening = {
        screening_decision: 'promote_to_referral',
        screening_decision_detai: '',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('errors')).toEqualImmutable(List())
    })

    it('returns a label for the field', () => {
      const screening = {
        screening_decision: 'promote_to_referral',
        screening_decision_detai: '',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('label')).toEqual('Response time')
    })

    it('returns an empty label if screening_decision is empty', () => {
      const screening = {
        screening_decision: '',
        screening_decision_detai: '',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('label')).toEqual('')
    })

    it('is required if screening decision is promote_to_referral', () => {
      const screening = {
        screening_decision: 'promote_to_referral',
        screening_decision_detai: '',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('required')).toEqual(true)
    })

    it('is not required if screening decision is not promote_to_referral', () => {
      const screening = {
        screening_decision: 'differential_response',
        screening_decision_detai: '',
      }
      const state = fromJS({screening})
      expect(getDecisionDetailSelector(state).get('required')).toEqual(false)
    })
  })
})
