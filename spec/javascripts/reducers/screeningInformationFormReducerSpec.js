import {Map, fromJS} from 'immutable'
import {
  resetFieldValues,
  setField,
  touchField,
  touchAllFields,
} from 'actions/screeningInformationFormActions'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'
import * as matchers from 'jasmine-immutable-matchers'
import screeningInformationFormReducer from 'reducers/screeningInformationFormReducer'

describe('screeningInformationFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the screening information form', () => {
      const action = fetchScreeningSuccess({
        name: 'a sample screening name',
        assignee: 'a screening assignee',
        started_at: 'a start date time',
        ended_at: 'an end date time',
        communication_method: 'a communication method',
      })
      expect(screeningInformationFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          name: {
            value: 'a sample screening name',
            touched: false,
          },
          assignee: {
            value: 'a screening assignee',
            touched: false,
          },
          started_at: {
            value: 'a start date time',
            touched: false,
          },
          ended_at: {
            value: 'an end date time',
            touched: false,
          },
          communication_method: {
            value: 'a communication method',
            touched: false,
          },
        })
      )
    })
    it('returns the last state on failure', () => {
      const lastState = fromJS({
        name: {
          value: 'a sample screening name',
          touched: false,
        },
        assignee: {
          value: 'a screening assignee',
          touched: false,
        },
        started_at: {
          value: 'a start date time',
          touched: false,
        },
        ended_at: {
          value: 'an end date time',
          touched: false,
        },
        communication_method: {
          value: 'a communication method',
          touched: false,
        },
      })
      const action = fetchScreeningFailure({
        name: '',
        assignee: '',
        started_at: '',
        ended_at: '',
        communication_method: '',
      })
      expect(screeningInformationFormReducer(lastState, action))
        .toEqualImmutable(lastState)
    })
  })

  describe('on RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES', () => {
    const lastState = fromJS({
      name: {
        value: 'the old screening name',
        touched: false,
      },
      assignee: {
        value: 'the old screening assignee',
        touched: false,
      },
      started_at: {
        value: 'the old start date time',
        touched: true,
      },
      ended_at: {
        value: 'the old end date time',
        touched: true,
      },
      communication_method: {
        value: 'the old communication method',
        touched: true,
      },
    })
    const action = resetFieldValues({
      name: 'a new screening name',
      assignee: 'a new screening assignee',
      started_at: 'a new start date time',
      ended_at: 'a new end date time',
      communication_method: 'a new communication method',
    })

    it('updates the screening information form', () => {
      expect(screeningInformationFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          name: {
            value: 'a new screening name',
            touched: false,
          },
          assignee: {
            value: 'a new screening assignee',
            touched: false,
          },
          started_at: {
            value: 'a new start date time',
            touched: true,
          },
          ended_at: {
            value: 'a new end date time',
            touched: true,
          },
          communication_method: {
            value: 'a new communication method',
            touched: true,
          },
        })
      )
    })
  })

  describe('on SET_SCREENING_INFORMATION_FORM_FIELD', () => {
    const action = setField('name', 'a new name')
    const lastState = fromJS({
      name: {
        value: 'the old sample screening name',
        touched: true,
      },
      assignee: {
        value: 'the old sample screening assignee',
        touched: false,
      },
    })
    it('returns the narrative with the newly updated value, but touched remains the same', () => {
      expect(screeningInformationFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          name: {
            value: 'a new name',
            touched: true,
          },
          assignee: {
            value: 'the old sample screening assignee',
            touched: false,
          },
        })
      )
    })
  })

  describe('on TOUCH_SCREENING_INFORMATION_FORM_FIELD', () => {
    const action = touchField('name')
    const lastState = fromJS({
      name: {
        value: 'a screening name',
        touched: false,
      },
    })
    it('returns the field with touched set to true, but the value remains the same', () => {
      expect(screeningInformationFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          name: {
            value: 'a screening name',
            touched: true,
          },
        })
      )
    })
  })

  describe('on TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS', () => {
    const action = touchAllFields()
    const lastState = fromJS({
      name: {
        value: 'a sample screening name',
        touched: false,
      },
      assignee: {
        value: 'a screening assignee',
        touched: false,
      },
      started_at: {
        value: 'a start date time',
        touched: false,
      },
      ended_at: {
        value: 'an end date time',
        touched: false,
      },
      communication_method: {
        value: 'a communication method',
        touched: false,
      },
    })
    it('returns the form with all fields with touch touched set to true', () => {
      expect(screeningInformationFormReducer(lastState, action)).toEqualImmutable(
        fromJS({
          name: {
            value: 'a sample screening name',
            touched: true,
          },
          assignee: {
            value: 'a screening assignee',
            touched: true,
          },
          started_at: {
            value: 'a start date time',
            touched: true,
          },
          ended_at: {
            value: 'an end date time',
            touched: true,
          },
          communication_method: {
            value: 'a communication method',
            touched: true,
          },
        })
      )
    })
  })
})
