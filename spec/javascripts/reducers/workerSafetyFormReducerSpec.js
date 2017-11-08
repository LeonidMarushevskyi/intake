import {Map, fromJS} from 'immutable'
import {
  resetFieldValues,
  setField,
} from 'actions/workerSafetyFormActions'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import * as matchers from 'jasmine-immutable-matchers'
import workerSafetyFormReducer from 'reducers/workerSafetyFormReducer'

describe('workerSafetyFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the worker safety form', () => {
      const action = fetchScreeningSuccess({
        safety_alerts: ['Worrysome'],
        safety_information: 'ABC',
      })
      expect(workerSafetyFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          safety_alerts: {value: ['Worrysome']},
          safety_information: {value: 'ABC'},
        })
      )
    })
    it('returns the worker safety form with default values on success', () => {
      const action = fetchScreeningSuccess({
        safety_alerts: null,
        safety_information: null,
      })
      expect(workerSafetyFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          safety_alerts: {value: null},
          safety_information: {value: null},
        })
      )
    })
    it('returns the last state on failure', () => {
      const action = fetchScreeningFailure()
      expect(workerSafetyFormReducer(Map(), action))
        .toEqualImmutable(Map())
    })
  })

  describe('on RESET_WORKER_SAFETY_FIELD_VALUES', () => {
    it('updates the worker safety form', () => {
      const action = resetFieldValues({
        safety_alerts: ['ABC'],
        safety_information: 'DEF',
      })
      const state = fromJS({
        safety_alerts: {value: ['123']},
        safety_information: {value: '123'},
      })
      expect(workerSafetyFormReducer(state, action)).toEqualImmutable(
        fromJS({
          safety_alerts: {value: ['ABC']},
          safety_information: {value: 'DEF'},
        })
      )
    })
  })

  describe('on SET_WORKER_SAFETY_FIELD', () => {
    it('returns the safety alerts field with the newly updated value', () => {
      const action = setField('safety_alerts', ['ABC'])
      const state = fromJS({safety_alerts: {value: ['123']}})
      expect(workerSafetyFormReducer(state, action)).toEqualImmutable(
        fromJS({
          safety_alerts: {
            value: ['ABC'],
          },
        })
      )
    })
    it('returns the safety information field with the newly updated value', () => {
      const action = setField('safety_information', 'ABC')
      const state = fromJS({safety_information: {value: '123'}})
      expect(workerSafetyFormReducer(state, action)).toEqualImmutable(
        fromJS({
          safety_information: {
            value: 'ABC',
          },
        })
      )
    })
  })
})
