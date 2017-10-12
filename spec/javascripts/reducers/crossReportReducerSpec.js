import {fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import crossReportReducer from 'reducers/crossReportReducer'
import {setField} from 'actions/crossReportActions'

describe('crossReportReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on SET_CROSS_REPORT_FIELD', () => {
    it('returns the cross report with the newly updated value, but touched remains the same', () => {
      const action = setField('county', '123')
      const state = fromJS({county: {value: '321', touched: false}})
      expect(crossReportReducer(state, action)).toEqualImmutable(
        fromJS({
          county: {
            value: '123',
            touched: false,
          },
        })
      )
    })
  })
})
