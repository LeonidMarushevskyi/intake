import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {
  CLEAR_CROSS_REPORT_VALUES,
  CLEAR_CROSS_REPORT_AGENCY_VALUES,
  RESET_CROSS_REPORT_VALUES,
  SAVE_CROSS_REPORT,
  SET_CROSS_REPORT_FIELD,
  SET_CROSS_REPORT_AGENCY,
  SET_CROSS_REPORT_AGENCY_TYPE,
  TOUCH_ALL_CROSS_REPORT_FIELDS,
  TOUCH_CROSS_REPORT_FIELD,
  TOUCH_CROSS_REPORT_AGENCY_FIELD,
} from 'actions/crossReportFormActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {AGENCY_TYPES} from 'enums/CrossReport'

const buildAgencyInformation = ({agencies}) => {
  const selectedAgencyTypes = agencies.map(({type}) => type)
  const agencyTypeToSelectedAgencyId = agencies.reduce((ids, {type, id}) => ({...ids, [type]: id}), {})
  return Object.keys(AGENCY_TYPES).reduce((info, type) => ({
    ...info,
    [type]: {
      selected: selectedAgencyTypes.includes(type),
      touched: false,
      agency: {
        value: agencyTypeToSelectedAgencyId[type] || '',
        touched: false,
      },
    },
  }), {})
}
const buildCrossReportForm = (crossReport = {agencies: []}) => {
  const agencyInformation = buildAgencyInformation(crossReport)
  if (crossReport.agencies.length === 0) {
    crossReport.inform_date = ''
    crossReport.method = ''
  }
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
  [CLEAR_CROSS_REPORT_VALUES](state) {
    return buildCrossReportForm({agencies: [], county_id: state.getIn(['county_id', 'value'])})
  },
  [CLEAR_CROSS_REPORT_AGENCY_VALUES](state, {payload: {agencyType}}) {
    return state.setIn([agencyType, 'agency', 'value'], '').setIn([agencyType, 'agency', 'touched'], false)
  },
  [RESET_CROSS_REPORT_VALUES](state, {payload: {screening: {cross_reports}}}) {
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
  [SET_CROSS_REPORT_AGENCY_TYPE](state, {payload: {field, value}}) {
    return state.setIn([field, 'selected'], value)
  },
  [SET_CROSS_REPORT_AGENCY](state, {payload: {agencyType, value}}) {
    return state.setIn([agencyType, 'agency', 'value'], value)
  },
  [SET_CROSS_REPORT_FIELD](state, {payload: {field, value}}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_ALL_CROSS_REPORT_FIELDS](state) {
    const agencyTypes = Object.keys(AGENCY_TYPES)
    const fieldsWithTouch = [
      'inform_date', 'method', 'county_id', ...agencyTypes,
    ]
    return fieldsWithTouch.reduce((state, field) => {
      if (agencyTypes.includes(field)) {
        return state.setIn([field, 'touched'], true).setIn([field, 'agency', 'touched'], true)
      } else {
        return state.setIn([field, 'touched'], true)
      }
    }, state)
  },
  [TOUCH_CROSS_REPORT_FIELD](state, {payload: {field}}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_CROSS_REPORT_AGENCY_FIELD](state, {payload: {agencyType}}) {
    return state.setIn([agencyType, 'agency', 'touched'], true)
  },
  [FETCH_SCREENING_COMPLETE](state, {payload: {screening}, error}) {
    if (error) {
      return state
    } else {
      return buildCrossReportFormFromScreening(screening)
    }
  },
  [SAVE_CROSS_REPORT](_state, {payload: {screening}}) {
    return buildCrossReportFormFromScreening(screening)
  },
})
