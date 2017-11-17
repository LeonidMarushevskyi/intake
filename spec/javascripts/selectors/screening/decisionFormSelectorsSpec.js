import {List, Map, fromJS} from 'immutable'
import {
  getAccessRestrictionOptionsSelector,
  getDecisionDetailOptionsSelector,
  getDecisionDetailSelector,
  getDecisionDetailValueSelector,
  getDecisionFormSelector,
  getDecisionOptionsSelector,
  getDecisionSelector,
  getDecisionValueSelector,
  getScreeningWithEditsSelector,
  getAdditionalInformationSelector,
  getAccessRestrictionSelector,
  getRestrictionRationaleSelector,
  getResetValuesSelector,
  getErrorsSelector,
  getVisibleErrorsSelector,
} from 'selectors/screening/decisionFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('screeningDecisionFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getDecisionOptionsSelector', () => {
    it('returns the enums for screening decisions in an object form with value and label', () => {
      expect(getDecisionOptionsSelector()).toEqualImmutable(fromJS([
        {value: 'differential_response', label: 'Differential response'},
        {value: 'information_to_child_welfare_services', label: 'Information to child welfare services'},
        {value: 'promote_to_referral', label: 'Promote to referral'},
        {value: 'screen_out', label: 'Screen out'},
      ]))
    })
  })

  describe('getAccessRestrictionOptionsSelector', () => {
    it('returns the enums for screening decisions in an object form with value and label', () => {
      expect(getAccessRestrictionOptionsSelector()).toEqualImmutable(fromJS([
        {value: '', label: 'Do not restrict access'},
        {value: 'sensitive', label: 'Mark as Sensitive'},
        {value: 'sealed', label: 'Mark as Sealed'},
      ]))
    })
  })

  describe('getDecisionFormSelector', () => {
    it('returns the decision form if one exists', () => {
      const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionFormSelector(state)).toEqualImmutable(fromJS(screeningDecisionForm))
    })

    it('returns an empty map if no form exists', () => {
      const state = fromJS({})
      expect(getDecisionFormSelector(state)).toEqualImmutable(Map())
    })
  })

  describe('getDecisionValueSelector', () => {
    it('returns the value from the screening form, if present', () => {
      const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionValueSelector(state)).toEqual('promote_to_referral')
    })
  })

  describe('getDecisionDetailValueSelector', () => {
    it('returns the value from the screening form, if present', () => {
      const screeningDecisionForm = {screening_decision_detail: {value: '3_day'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailValueSelector(state)).toEqual('3_day')
    })
  })

  describe('getDecisionDetailSelector', () => {
    it('returns the proper value', () => {
      const screeningDecisionForm = {screening_decision_detail: {value: '3_day'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('value')).toEqual('3_day')
    })

    it('returns an empty string if value is set to null', () => {
      const screeningDecisionForm = {screening_decision_detail: {value: null}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('value')).toEqual('')
    })

    it('returns a list of errors', () => {
      const screeningDecisionForm = {screening_decision_detail: {value: '3_day'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('errors')).toEqualImmutable(List())
    })

    it('returns the proper label based on screening decision', () => {
      const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('label')).toEqual('Response time')
    })

    it('returns an empty string if no valid label is found', () => {
      const screeningDecisionForm = {screening_decision: {value: ''}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('label')).toEqual('')
    })

    it('sets required to true if decision is promote_to_referral', () => {
      const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('required')).toEqual(true)
    })

    it('sets required to false if decision is not promote_to_referral', () => {
      const screeningDecisionForm = {screening_decision: {value: 'screen_out'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailSelector(state).get('required')).toEqual(false)
    })
  })

  describe('getDecisionSelector', () => {
    it('returns the proper value and a list of errors', () => {
      const screeningDecisionForm = {screening_decision: {value: 'screen_out'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionSelector(state)).toEqualImmutable(fromJS({
        value: 'screen_out',
        errors: [],
      }))
    })
  })

  describe('getDecisionDetailOptionsSelector', () => {
    it('returns formatted options when decision detail has options', () => {
      const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailOptionsSelector(state)).toEqualImmutable(fromJS([
        {value: 'immediate', label: 'Immediate'},
        {value: '3_days', label: '3 days'},
        {value: '5_days', label: '5 days'},
        {value: '10_days', label: '10 days'},
      ]))
    })

    it('returns an empty list if decision detail has no options', () => {
      const screeningDecisionForm = {screening_decision: {value: 'differential_response'}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailOptionsSelector(state)).toEqualImmutable(List())
    })

    it('returns an empty list if decision is empty', () => {
      const screeningDecisionForm = {screening_decision: {value: ''}}
      const state = fromJS({screeningDecisionForm})
      expect(getDecisionDetailOptionsSelector(state)).toEqualImmutable(List())
    })
  })

  describe('getAdditionalInformationSelector', () => {
    it('returns the proper value if one exists', () => {
      const screeningDecisionForm = {additional_information: {value: 'ABC'}}
      const state = fromJS({screeningDecisionForm})
      expect(getAdditionalInformationSelector(state).get('value')).toEqual('ABC')
    })

    it('returns an empty string if current value is null', () => {
      const screeningDecisionForm = {additional_information: {value: null}}
      const state = fromJS({screeningDecisionForm})
      expect(getAdditionalInformationSelector(state).get('value')).toEqual('')
    })
  })

  describe('getAccessRestrictionSelector', () => {
    it('returns the proper value if one exists', () => {
      const screeningDecisionForm = {access_restrictions: {value: 'ABC'}}
      const state = fromJS({screeningDecisionForm})
      expect(getAccessRestrictionSelector(state).get('value')).toEqual('ABC')
    })

    it('returns an empty string if current value is null', () => {
      const screeningDecisionForm = {access_restrictions: {value: null}}
      const state = fromJS({screeningDecisionForm})
      expect(getAccessRestrictionSelector(state).get('value')).toEqual('')
    })
  })

  describe('getRestrictionRationaleSelector', () => {
    it('returns the proper value if one exists', () => {
      const screeningDecisionForm = {restrictions_rationale: {value: 'ABC'}}
      const state = fromJS({screeningDecisionForm})
      expect(getRestrictionRationaleSelector(state).get('value')).toEqual('ABC')
    })

    it('returns an empty string if current value is null', () => {
      const screeningDecisionForm = {restrictions_rationale: {value: null}}
      const state = fromJS({screeningDecisionForm})
      expect(getRestrictionRationaleSelector(state).get('value')).toEqual('')
    })
  })

  describe('getScreeningWithEditsSelector', () => {
    it('replaces current saved screening values with form values', () => {
      const screening = {
        screening_decision: 'ABC',
        screening_decision_detail: 'DEF',
        additional_information: 'GHI',
        access_restrictions: 'JKL',
        restrictions_rationale: 'MNO',
        narrative: 'Hello',
      }
      const screeningDecisionForm = {
        screening_decision: {value: '1'},
        screening_decision_detail: {value: '2'},
        additional_information: {value: '3'},
        access_restrictions: {value: '4'},
        restrictions_rationale: {value: '5'},
      }
      const state = fromJS({screening, screeningDecisionForm})
      expect(getScreeningWithEditsSelector(state)).toEqualImmutable(fromJS({
        screening_decision: '1',
        screening_decision_detail: '2',
        additional_information: '3',
        access_restrictions: '4',
        restrictions_rationale: '5',
        narrative: 'Hello',
      }))
    })
  })

  describe('getResetValuesSelector', () => {
    it('returns the current values saved for the screening', () => {
      const screening = {
        screening_decision: 'ABC',
        screening_decision_detail: 'DEF',
        additional_information: 'GHI',
        access_restrictions: 'JKL',
        restrictions_rationale: 'MNO',
      }
      const state = fromJS({screening})
      expect(getResetValuesSelector(state)).toEqualImmutable(fromJS(screening))
    })
  })

  describe('getErrorsSelector', () => {
    describe('screening decision', () => {
      it('includes an error message if screening decision is empty', () => {
        const screeningDecisionForm = {}
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List(['Please enter a decision']))
      })

      it('does not include an error message if screening decision is present', () => {
        const screeningDecisionForm = {screening_decision: {value: 'screen_out'}}
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List())
      })

      it('includes an error message if decision is promote to referral and allegations are empty', () => {
        const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
        const allegationsForm = [{allegationTypes: []}]
        const state = fromJS({screeningDecisionForm, allegationsForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List(['Please enter at least one allegation to promote to referral.']))
      })

      it('does not include an error message if decision is promote to referral and allegations are present', () => {
        const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
        const allegationsForm = [{allegationTypes: ['General neglect']}]
        const state = fromJS({screeningDecisionForm, allegationsForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List())
      })

      it('includes an error message if decision is not promote to referral, even if allegations are empty', () => {
        const screeningDecisionForm = {screening_decision: {value: 'screen_out'}}
        const allegationsForm = [{allegationTypes: []}]
        const state = fromJS({screeningDecisionForm, allegationsForm})
        expect(getErrorsSelector(state).get('screening_decision'))
          .toEqualImmutable(List())
      })
    })

    describe('screening decision detail', () => {
      it('includes an error message if decision is promote to referral and no detail is present', () => {
        const screeningDecisionForm = {screening_decision: {value: 'promote_to_referral'}}
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('screening_decision_detail'))
          .toEqualImmutable(List(['Please enter a response time']))
      })

      it('does not include an error message if decision is promote to referral and detail is present', () => {
        const screeningDecisionForm = {
          screening_decision: {value: 'promote_to_referral'},
          screening_decision_detail: {value: '3_days'},
        }
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('screening_decision_detail'))
          .toEqualImmutable(List())
      })

      it('does not include an error message if decision is not promote to referral, even when detail is empty', () => {
        const screeningDecisionForm = {screening_decision: {value: 'screen_out'}}
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('screening_decision_detail'))
          .toEqualImmutable(List())
      })
    })

    describe('restrictions rationale', () => {
      it('includes an error message if restrictions rationale is empty', () => {
        const screeningDecisionForm = { }
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('restrictions_rationale'))
          .toEqualImmutable(List(['Please enter an access restriction reason'])
          )
      })

      it('excludes an error message if restrictions rationale is not empty', () => {
        const screeningDecisionForm = {
          restrictions_rationale: {
            value: 'a rationale',
          },
        }
        const state = fromJS({screeningDecisionForm})
        expect(getErrorsSelector(state).get('restrictions_rationale'))
          .toEqualImmutable(List([])
          )
      })
    })
  })

  describe('getVisibleErrorsSelector', () => {
    it('returns an error if the field has a validation and is touched', () => {
      const screeningDecisionForm = {
        screening_decision: {value: 'promote_to_referral', touched: true},
        screening_decision_detail: {value: '', touched: true},
      }
      const allegationsForm = [{allegationTypes: []}]
      const state = fromJS({screeningDecisionForm, allegationsForm})
      const errors = getVisibleErrorsSelector(state)
      expect(errors.get('screening_decision'))
        .toEqualImmutable(List(['Please enter at least one allegation to promote to referral.']))
      expect(errors.get('screening_decision_detail'))
        .toEqualImmutable(List(['Please enter a response time']))
    })

    it('does not return an error if the field has not been touched', () => {
      const screeningDecisionForm = {
        screening_decision: {value: 'promote_to_referral', touched: false},
        screening_decision_detail: {value: '', touched: false},
      }
      const allegationsForm = [{allegationTypes: []}]
      const state = fromJS({screeningDecisionForm, allegationsForm})
      const errors = getVisibleErrorsSelector(state)
      expect(errors.every((fieldErrors) => fieldErrors.isEmpty())).toEqual(true)
    })
  })
})
