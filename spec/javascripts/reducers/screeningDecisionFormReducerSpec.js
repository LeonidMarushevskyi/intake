import {Map, fromJS} from 'immutable'
import {
  resetFieldValues,
  setField,
  touchField,
  touchAllFields,
} from 'actions/screeningDecisionFormActions'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import * as matchers from 'jasmine-immutable-matchers'
import screeningDecisionFormReducer from 'reducers/screeningDecisionFormReducer'

describe('screeningDecisionFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the screening decision form', () => {
      const action = fetchScreeningSuccess({
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '3_day',
        access_restrictions: 'sealed',
        restrictions_rationale: 'Because I said so',
        additional_information: 'Really bad thing happened.',
      })
      expect(screeningDecisionFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          screening_decision: {
            value: 'promote_to_referral',
            touched: false,
          },
          screening_decision_detail: {
            value: '3_day',
            touched: false,
          },
          access_restrictions: {
            value: 'sealed',
            touched: false,
          },
          restrictions_rationale: {
            value: 'Because I said so',
            touched: false,
          },
          additional_information: {
            value: 'Really bad thing happened.',
            touched: false,
          },
        })
      )
    })
    it('returns the last state on failure', () => {
      const action = fetchScreeningFailure()
      expect(screeningDecisionFormReducer(Map(), action))
        .toEqualImmutable(Map())
    })
  })

  describe('on RESET_SCREENING_DECISION_FIELD_VALUES', () => {
    it('updates the values for the decision form', () => {
      const action = resetFieldValues({
        screening_decision: 'ABC',
        screening_decision_detail: 'DEF',
        additional_information: 'GHI',
        access_restrictions: 'JKL',
        restrictions_rationale: 'MNO',
      })
      const state = fromJS({
        screening_decision: {value: '123', touched: false},
        screening_decision_detail: {value: '123', touched: false},
        additional_information: {value: '123', touched: false},
        access_restrictions: {value: '123', touched: false},
        restrictions_rationale: {value: '123', touched: false},
      })
      expect(screeningDecisionFormReducer(state, action)).toEqualImmutable(
        fromJS({
          screening_decision: {value: 'ABC', touched: false},
          screening_decision_detail: {value: 'DEF', touched: false},
          additional_information: {value: 'GHI', touched: false},
          access_restrictions: {value: 'JKL', touched: false},
          restrictions_rationale: {value: 'MNO', touched: false}})
      )
    })
  })

  describe('on SET_SCREENING_DECISION_FIELD', () => {
    it('returns the decision with the newly updated value, but touched remains the same', () => {
      const action = setField({field: 'screening_decision', value: 'ABC'})
      const state = fromJS({screening_decision: {value: '123', touched: false}})
      expect(screeningDecisionFormReducer(state, action)).toEqualImmutable(
        fromJS({
          screening_decision: {
            value: 'ABC',
            touched: false,
          },
        })
      )
    })
  })

  describe('on TOUCH_SCREENING_DECISION_FIELD', () => {
    it('returns the decision with touched set to true, but the value remains the same', () => {
      const action = touchField({field: 'screening_decision'})
      const state = fromJS({screening_decision: {value: '123', touched: false}})
      expect(screeningDecisionFormReducer(state, action)).toEqualImmutable(
        fromJS({
          screening_decision: {
            value: '123',
            touched: true,
          },
        })
      )
    })
  })

  describe('on TOUCH_ALL_SCREENING_DECISION_FIELDS', () => {
    it('returns the decision with all fields with touch touched set to true', () => {
      const action = touchAllFields()
      const state = fromJS({
        screening_decision: {value: '123', touched: false},
        screening_decision_detail: {value: '123', touched: false},
        additional_information: {value: '123', touched: false},
        access_restrictions: {value: '123', touched: false},
        restrictions_rationale: {value: '123', touched: false},
      })
      expect(screeningDecisionFormReducer(state, action)).toEqualImmutable(
        fromJS({
          screening_decision: {value: '123', touched: true},
          screening_decision_detail: {value: '123', touched: true},
          additional_information: {value: '123', touched: true},
          access_restrictions: {value: '123', touched: true},
          restrictions_rationale: {value: '123', touched: true},
        })
      )
    })
  })
})

