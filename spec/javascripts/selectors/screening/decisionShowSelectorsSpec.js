import {fromJS, List} from 'immutable'
import {
  getDecisionSelector,
  getDecisionDetailSelector,
  getErrorsSelector,
  getRestrictionRationaleSelector,
} from 'selectors/screening/decisionShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('allegationShowSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getDecisionSelector', () => {
    it('returns the human-readable value of the screening decision', () => {
      const screening = {screening_decision: 'screen_out'}
      const state = fromJS({screening})
      expect(getDecisionSelector(state).get('value')).toEqual('Screen out')
    })

    it('returns errors for screening decision', () => {
      const screening = {screening_decision: 'screen_out'}
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
        screening_decision: 'screen_out',
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

  describe('getErrorsSelector', () => {
    describe('screening decision', () => {
      it('includes an error message if screening decision is empty', () => {
        const screening = {}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List(['Please enter a decision']))
      })

      it('does not include an error message if screening decision is present', () => {
        const screening = {screening_decision: 'screen_out'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List())
      })

      it('includes an error message if decision is promote to referral and allegations are empty', () => {
        const screening = {screening_decision: 'promote_to_referral'}
        const allegationsForm = [{allegationTypes: []}]
        const state = fromJS({screening, allegationsForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List(['Please enter at least one allegation to promote to referral.']))
      })

      it('does not include an error message if decision is promote to referral and allegations are present', () => {
        const screening = {screening_decision: 'promote_to_referral'}
        const allegationsForm = [{allegationTypes: ['General neglect']}]
        const state = fromJS({screening, allegationsForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List())
      })

      it('includes an error message if decision is not promote to referral, even if allegations are empty', () => {
        const screening = {screening_decision: 'screen_out'}
        const allegationsForm = [{allegationTypes: []}]
        const state = fromJS({screening, allegationsForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List())
      })
    })

    describe('screening decision detail', () => {
      it('includes an error message if decision is promote to referral and no detail is present', () => {
        const screening = {screening_decision: 'promote_to_referral'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('screening_decision_detail'))
          .toEqualImmutable(List(['Please enter a response time']))
      })

      it('does not include an error message if decision is promote to referral and detail is present', () => {
        const screening = {screening_decision: 'promote_to_referral', screening_decision_detail: '3_days'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('screening_decision_detail'))
          .toEqualImmutable(List())
      })

      it('does not include an error message if decision is not promote to referral, even when detail is empty', () => {
        const screening = {screening_decision: 'screen_out'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('screening_decision_detail'))
          .toEqualImmutable(List())
      })
    })

    describe('restrictions rationale', () => {
      it('returns an error if there is no rationale', () => {
        const screening = { }
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('restrictions_rationale'))
          .toEqualImmutable(List(['Please enter an access restriction reason']))
      })

      it('returns no error if there is a rationale', () => {
        const screening = {restrictions_rationale: 'rationale'}
        const state = fromJS({screening})
        expect(getErrorsSelector(state).get('restrictions_rationale'))
          .toEqualImmutable(List())
      })
    })
  })

  describe('getRestrictionRationaleSelector', () => {
    it('returns the proper value if one exists', () => {
      const screening = {restrictions_rationale: 'ABC'}
      const state = fromJS({screening})
      expect(getRestrictionRationaleSelector(state).get('value')).toEqual('ABC')
    })

    it('returns an empty string if current value is null', () => {
      const screening = {restrictions_rationale: null}
      const state = fromJS({screening})
      expect(getRestrictionRationaleSelector(state).get('value')).toEqual('')
    })
  })
})
