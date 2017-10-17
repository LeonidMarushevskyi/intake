import {Map, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import crossReportReducer from 'reducers/crossReportReducer'
import {setField} from 'actions/crossReportActions'
import {fetchScreeningSuccess} from 'actions/screeningActions'

describe('crossReportReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the cross report with the values from screening', () => {
      const action = fetchScreeningSuccess({
        cross_reports: [
          {
            county_id: '1234',
            inform_date: '2017-02-20',
            method: 'Child Abuse Form',
            agencies: [
              {id: '1234', type: 'DISTRICT_ATTORNEY'},
              {id: '5234', type: 'LAW_ENFORCEMENT'},
            ],
          },
        ],
      })
      expect(crossReportReducer(Map(), action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '1234',
            touched: false,
          },
          inform_date: {
            value: '2017-02-20',
            touched: false,
          },
          method: {
            value: 'Child Abuse Form',
            touched: false,
          },
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '1234',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: false,
            agency: {
              value: '5234',
              touched: false,
            },
          },
          DEPARTMENT_OF_JUSTICE: {
            selected: false,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
        })
      )
    })
  })
  describe('on SET_CROSS_REPORT_FIELD', () => {
    it('returns the cross report with the newly updated value, but touched remains the same', () => {
      const action = setField('county_id', '123')
      const state = fromJS({county_id: {value: '321', touched: false}})
      expect(crossReportReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '123',
            touched: true,
          },
        })
      )
    })
  })
})
