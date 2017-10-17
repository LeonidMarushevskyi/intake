import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {SET_CROSS_REPORT_FIELD} from 'actions/crossReportFormActions'
import {FETCH_SCREENING_SUCCESS} from 'actions/actionTypes'
import {
  AGENCY_TYPES,
} from 'enums/CrossReport'

export default createReducer(Map(), {
  [SET_CROSS_REPORT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value).setIn([field, 'touched'], true)
  },
  [FETCH_SCREENING_SUCCESS](_state, {screening: {cross_reports}}) {
    if (cross_reports && cross_reports.length > 0) {
      const crossReport = cross_reports[0]
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
      return fromJS({
        county_id: {
          value: crossReport.county_id,
          touched: false,
        },
        inform_date: {
          value: crossReport.inform_date,
          touched: false,
        },
        method: {
          value: crossReport.method,
          touched: false,
        },
        ...agencyInformation,
      })
    } else {
      return Map()
    }
  },
})
