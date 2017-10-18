import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {
  CLEAR_CROSS_REPORT_FIELD_VALUES,
  CLEAR_CROSS_REPORT_AGENCY_FIELD_VALUES,
  RESET_CROSS_REPORT_FIELD_VALUES,
  SET_CROSS_REPORT_FIELD,
  SET_CROSS_REPORT_AGENCY_FIELD,
  SET_CROSS_REPORT_AGENCY_TYPE_FIELD,
  TOUCH_CROSS_REPORT_FIELD,
  TOUCH_CROSS_REPORT_AGENCY_FIELD,
} from 'actions/crossReportFormActions'
import {FETCH_SCREENING_SUCCESS} from 'actions/actionTypes'
import {
  AGENCY_TYPES,
} from 'enums/CrossReport'

const build_agency_information = (crossReport) => {
  const agencyInformation = Object.keys(AGENCY_TYPES).reduce((info, type) => {
    info[type] = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    }
    return info
  }, {})
  if (crossReport.agencies) {
    crossReport.agencies.map((agency) => {
      agencyInformation[agency.type].selected = true
      if (agency.id) {
        agencyInformation[agency.type].agency.value = agency.id
      }
    })
  }
  return agencyInformation
}
const build_cross_report_form = (crossReport) => {
  const agencyInformation = build_agency_information(crossReport)
  return fromJS({
    county_id: {
      value: crossReport.county_id || '',
      touched: false,
    },
    inform_date: {
      value: crossReport.inform_date || '',
      touched: false,
    },
    method: {
      value: crossReport.method || '',
      touched: false,
    },
    ...agencyInformation,
  })
}
const build_cross_report_form_from_screening = ({cross_reports}) => {
  if (cross_reports && cross_reports.length > 0) {
    return build_cross_report_form(cross_reports[0])
  } else {
    return build_cross_report_form({})
  }
}
export default createReducer(Map(), {
  [CLEAR_CROSS_REPORT_FIELD_VALUES](state) {
    return build_cross_report_form({county_id: state.getIn(['county_id', 'value'])})
  },
  [CLEAR_CROSS_REPORT_AGENCY_FIELD_VALUES](state, {agencyType}) {
    return state.setIn([agencyType, 'agency', 'value'], '').setIn([agencyType, 'agency', 'touched'], false)
  },
  [RESET_CROSS_REPORT_FIELD_VALUES](state, {screening: {cross_reports}}) {
    if (cross_reports && cross_reports.length > 0) {
      const crossReport = cross_reports[0]
      let newState = fromJS(AGENCY_TYPES).reduce(
        (state, _value, type) => state.setIn([type, 'selected'], false),
        state
      )
      if (crossReport.agencies) {
        newState = crossReport.agencies.reduce((state, agency) => state
          .setIn([agency.type, 'selected'], true)
          .setIn([agency.type, 'agency', 'value'], (agency.id) ? agency.id : ''), newState)
      }
      return newState.setIn(['county_id', 'value'], crossReport.county_id)
        .setIn(['inform_date', 'value'], crossReport.inform_date)
        .setIn(['method', 'value'], crossReport.method)
    } else {
      return build_cross_report_form({})
    }
  },
  [SET_CROSS_REPORT_AGENCY_TYPE_FIELD](state, {field, value}) {
    return state.setIn([field, 'selected'], value)
  },
  [SET_CROSS_REPORT_AGENCY_FIELD](state, {agencyType, value}) {
    return state.setIn([agencyType, 'agency', 'value'], value)
  },
  [SET_CROSS_REPORT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_CROSS_REPORT_FIELD](state, {field}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_CROSS_REPORT_AGENCY_FIELD](state, {agencyType}) {
    return state.setIn([agencyType, 'agency', 'touched'], true)
  },
  [FETCH_SCREENING_SUCCESS](_state, {screening}) {
    return build_cross_report_form_from_screening(screening)
  },
})
