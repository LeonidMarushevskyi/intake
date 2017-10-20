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
import {AGENCY_TYPES} from 'enums/CrossReport'

const buildAgencyInformation = ({agencies}) => {
  const agencyInformation = Object.keys(AGENCY_TYPES).reduce((info, type) => {
    const savedTypes = agencies.map(({type}) => type)
    const savedIds = agencies.reduce((ids, {type, id}) => ({...ids, [type]: id}), {})
    return {
      ...info,
      [type]: {
        selected: savedTypes.includes(type),
        touched: false,
        agency: {
          value: savedIds[type] || '',
          touched: false,
        },
      },
    }
  }, {})
  return agencyInformation
}
const buildCrossReportForm = (crossReport = {agencies: []}) => {
  const agencyInformation = buildAgencyInformation(crossReport)
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
const buildCrossReportFormFromScreening = ({cross_reports}) => {
  if (cross_reports && cross_reports.length > 0) {
    return buildCrossReportForm(cross_reports[0])
  } else {
    return buildCrossReportForm()
  }
}
export default createReducer(Map(), {
  [CLEAR_CROSS_REPORT_FIELD_VALUES](state) {
    return buildCrossReportForm({agencies: [], county_id: state.getIn(['county_id', 'value'])})
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
      return buildCrossReportForm()
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
    return buildCrossReportFormFromScreening(screening)
  },
})
