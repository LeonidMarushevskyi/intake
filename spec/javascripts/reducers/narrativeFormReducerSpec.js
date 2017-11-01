import {Map, fromJS} from 'immutable'
import {
  resetFieldValues,
  setField,
  touchField,
  touchAllFields,
} from 'actions/narrativeFormActions'
import {fetchScreeningSuccess} from 'actions/screeningActions'
import * as matchers from 'jasmine-immutable-matchers'
import narrativeFormReducer from 'reducers/narrativeFormReducer'

describe('narrativeFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the narrative form', () => {
      const action = fetchScreeningSuccess({report_narrative: 'ABC'})
      expect(narrativeFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          report_narrative: {
            value: 'ABC',
            touched: false,
          },
        })
      )
    })
    it('returns the narrative form with default empty string', () => {
      const action = fetchScreeningSuccess({report_narrative: null})
      expect(narrativeFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          report_narrative: {
            value: '',
            touched: false,
          },
        })
      )
    })
  })

  describe('on RESET_NARRATIVE_FIELD_VALUES', () => {
    it('updates the narrative form', () => {
      const action = resetFieldValues({report_narrative: 'ABC'})
      const state = fromJS({report_narrative: {value: '123', touched: true}})
      expect(narrativeFormReducer(state, action)).toEqualImmutable(
        fromJS({
          report_narrative: {
            value: 'ABC',
            touched: true,
          },
        })
      )
    })
  })

  describe('on SET_NARRATIVE_FIELD', () => {
    it('returns the narrative with the newly updated value, but touched remains the same', () => {
      const action = setField('report_narrative', 'ABC')
      const state = fromJS({report_narrative: {value: '123', touched: false}})
      expect(narrativeFormReducer(state, action)).toEqualImmutable(
        fromJS({
          report_narrative: {
            value: 'ABC',
            touched: false,
          },
        })
      )
    })
  })

  describe('on TOUCH_NARRATIVE_FIELD', () => {
    it('returns the narrative with touched set to true, but the value remains the same', () => {
      const action = touchField('report_narrative')
      const state = fromJS({report_narrative: {value: '123', touched: false}})
      expect(narrativeFormReducer(state, action)).toEqualImmutable(
        fromJS({
          report_narrative: {
            value: '123',
            touched: true,
          },
        })
      )
    })
  })

  describe('on TOUCH_ALL_NARRATIVE_FIELDS', () => {
    it('returns the contact with all fields with touch touched set to true', () => {
      const action = touchAllFields()
      const state = fromJS({report_narrative: {value: '123', touched: false}})
      expect(narrativeFormReducer(state, action)).toEqualImmutable(
        fromJS({
          report_narrative: {
            value: '123',
            touched: true,
          },
        })
      )
    })
  })
})
