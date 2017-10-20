import {createSelector} from 'reselect'
import {getCountyAgenciesSelector} from 'selectors/countyAgenciesSelectors'
import {Map, List} from 'immutable'
import {AGENCY_TYPES} from 'enums/CrossReport'

export const getCrossReportSelector = (state) => state.getIn(['screening', 'cross_reports', 0]) || Map()

export const getCrossReportAgenciesSelector = (state) => state.getIn(['screening', 'cross_reports', 0, 'agencies']) || List()

export const getAgencyCodeToNameSelector = createSelector(
  getCrossReportAgenciesSelector,
  getCountyAgenciesSelector,
  (agencies, countyAgencies) => agencies.reduce((agencyCodeToName, agency) => {
    const agencyTypeName = AGENCY_TYPES[agency.get('type')]
    const agencyCode = agency.get('id')
    if (agencyCode) {
      const agencyData = countyAgencies.find((countyAgency) => countyAgency.get('id') === agencyCode)
      if (agencyData && agencyData.get('name')) {
        agencyCodeToName[agencyCode] = `${agencyTypeName} - ${agencyData.get('name')}`
      } else {
        agencyCodeToName[agencyCode] = `${agencyTypeName} - ${agencyCode}`
      }
    }
    return agencyCodeToName
  }, {})
)

export const getSelectedCrossReportAgencyNamesSelector = createSelector(
  getCrossReportAgenciesSelector,
  getAgencyCodeToNameSelector,
  (agencies, agencyCodeToName) => agencies.reduce((names, agency) => {
    const {type, id} = agency.toJS()
    return names.push(id ? agencyCodeToName[id] : AGENCY_TYPES[type])
  }, List())
)
