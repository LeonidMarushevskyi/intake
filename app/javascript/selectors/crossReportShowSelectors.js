import {createSelector} from 'reselect'
import {getCountyAgenciesSelector} from 'selectors/countyAgenciesSelectors'
import {Map, List, fromJS} from 'immutable'
import {
  AGENCY_TYPES,
  CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS,
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
  LAW_ENFORCEMENT,
} from 'enums/CrossReport'
import {
  isRequiredIfCreate,
  combineCompact,
} from 'utils/validator'
import {areCrossReportsRequired} from 'utils/allegationsHelper'

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
    return names.set(type, id ? agencyCodeToName[id] : AGENCY_TYPES[type])
  }, Map())
)

const findAgencyData = (agencies, agencyType) => {
  const agency = agencies.find((agency) => agency.get('type') === agencyType)
  if (agency) {
    return agency.toJS()
  } else {
    return {}
  }
}

const isBlank = (value) => (value === undefined || value === '')

export const getAgencyRequiredErrors = (type, agencies, allegations) => {
  const {selectedType, id} = findAgencyData(agencies, type)
  if (areCrossReportsRequired(allegations) && isBlank(selectedType) && isBlank(id)) {
    return `Please indicate cross-reporting to ${AGENCY_TYPES[type].toLowerCase()}.`
  }
  return undefined
}
export const getDistrictAttorneyErrors = (agencies) => {
  const {type, id} = findAgencyData(agencies, DISTRICT_ATTORNEY)
  if (isBlank(type) || id) {
    return undefined
  } else {
    return 'Please enter an agency name.'
  }
}

export const getDepartmentOfJusticeErrors = (agencies) => {
  const {type, id} = findAgencyData(agencies, DEPARTMENT_OF_JUSTICE)
  if (isBlank(type) || id) {
    return undefined
  } else {
    return 'Please enter an agency name.'
  }
}

export const getLawEnforcementErrors = (agencies) => {
  const {type, id} = findAgencyData(agencies, LAW_ENFORCEMENT)
  if (isBlank(type) || id) {
    return undefined
  } else {
    return 'Please enter an agency name.'
  }
}

export const getCountyLicensingErrors = (agencies) => {
  const {type, id} = findAgencyData(agencies, COUNTY_LICENSING)
  if (isBlank(type) || id) {
    return undefined
  } else {
    return 'Please enter an agency name.'
  }
}

export const getCommunityCareLicensingErrors = (agencies) => {
  const {type, id} = findAgencyData(agencies, COMMUNITY_CARE_LICENSING)
  if (isBlank(type) || id) {
    return undefined
  } else {
    return 'Please enter an agency name.'
  }
}

export const getAllegationsRequireCrossReportsValueSelector = createSelector(
  getCrossReportAgenciesSelector,
  (state) => state.getIn(['screening', 'allegations']),
  (agencies, allegations) => areCrossReportsRequired(allegations) && !CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS.reduce((hasRequiredAgencies, requiredAgencyType) => hasRequiredAgencies && Boolean(agencies.find((agency) => (
    agency.get('type') === requiredAgencyType
  ))), true)
)

export const getErrorsSelector = createSelector(
  getCrossReportSelector,
  getCrossReportAgenciesSelector,
  (state) => state.getIn(['screening', 'allegations']),
  (crossReport, agencies, allegations) => fromJS({
    informDate: combineCompact(isRequiredIfCreate(crossReport.get('inform_date'), 'Please enter a cross-report date.', () => (agencies.size !== 0))),
    method: combineCompact(isRequiredIfCreate(crossReport.get('method'), 'Please select a cross-report communication method.', () => (agencies.size !== 0))),
    [COMMUNITY_CARE_LICENSING]: combineCompact(() => (getCommunityCareLicensingErrors(agencies))),
    [COUNTY_LICENSING]: combineCompact(() => (getCountyLicensingErrors(agencies))),
    [DEPARTMENT_OF_JUSTICE]: combineCompact(() => (getDepartmentOfJusticeErrors(agencies))),
    [DISTRICT_ATTORNEY]: combineCompact(() => (getDistrictAttorneyErrors(agencies))),
    [LAW_ENFORCEMENT]: combineCompact(() => (getLawEnforcementErrors(agencies))),
    agencyRequired: combineCompact(
      () => {
        if (getDistrictAttorneyErrors(agencies)) {
          return undefined
        } else {
          return getAgencyRequiredErrors(DISTRICT_ATTORNEY, agencies, allegations)
        }
      },
      () => {
        if (getLawEnforcementErrors(agencies)) {
          return undefined
        } else {
          return getAgencyRequiredErrors(LAW_ENFORCEMENT, agencies, allegations)
        }
      }
    ),
  })
)
