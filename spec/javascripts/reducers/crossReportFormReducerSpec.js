import {Map, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import crossReportFormReducer from 'reducers/crossReportFormReducer'
import {
  resetFieldValues,
  setAgencyField,
  setAgencyTypeField,
  setField,
  touchField,
  touchAgencyField,
} from 'actions/crossReportFormActions'
import {fetchScreeningSuccess} from 'actions/screeningActions'

describe('crossReportFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on RESET_CROSS_REPORT_FIELD_VALUES', () => {
    it('updates the cross report form', () => {
      const action = resetFieldValues({
        cross_reports: [
          {
            county_id: '4234',
            inform_date: '2017-02-20',
            method: '',
            agencies: [
              {type: 'DISTRICT_ATTORNEY'},
              {type: 'LAW_ENFORCEMENT'},
            ],
          },
        ],
      })
      const state = fromJS({
        county_id: {
          value: '1234',
          touched: true,
        },
        inform_date: {
          value: '2017-02-20',
          touched: false,
        },
        method: {
          value: 'Child Abuse Form',
          touched: true,
        },
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '5234',
            touched: true,
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
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '4234',
            touched: true,
          },
          inform_date: {
            value: '2017-02-20',
            touched: false,
          },
          method: {
            value: '',
            touched: true,
          },
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '',
              touched: true,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: false,
            agency: {
              value: '',
              touched: true,
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
      expect(crossReportFormReducer(Map(), action)).toEqualImmutable(
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
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '123',
            touched: false,
          },
        })
      )
    })
  })
  describe('on TOUCH_CROSS_REPORT_FIELD', () => {
    it('returns the cross report value with touched set to true', () => {
      const action = touchField('DISTRICT_ATTORNEY')
      const state = fromJS({DISTRICT_ATTORNEY: {selected: false, touched: false}})
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: false,
            touched: true,
          },
        })
      )
    })
  })
  describe('on SET_CROSS_REPORT_AGENCY_TYPE_FIELD', () => {
    it('sets the value of selected for the agency type', () => {
      const action = setAgencyTypeField('DISTRICT_ATTORNEY', true)
      const state = fromJS({DISTRICT_ATTORNEY: {selected: false, touched: false}})
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
          },
        })
      )
    })
  })
  describe('on TOUCH_CROSS_REPORT_AGENCY_FIELD', () => {
    it('returns the cross report value with touched set to true', () => {
      const action = touchAgencyField('DISTRICT_ATTORNEY')
      const state = fromJS({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234AAB',
            touched: false,
          },
        },
      })
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '1234AAB',
              touched: true,
            },
          },
        })
      )
    })
  })
  describe('on SET_CROSS_REPORT_AGENCY_FIELD', () => {
    it('sets the value of selected for the agency type', () => {
      const action = setAgencyField('DISTRICT_ATTORNEY', '1234AAB')
      const state = fromJS({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
      })
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '1234AAB',
              touched: false,
            },
          },
        })
      )
    })
  })
})
