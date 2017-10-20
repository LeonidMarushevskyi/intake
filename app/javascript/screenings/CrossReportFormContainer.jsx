import {
  AGENCY_TYPES,
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import {
  getDistrictAttorneyAgenciesSelector,
  getDepartmentOfJusticeAgenciesSelector,
  getLawEnforcementAgenciesSelector,
  getCountyLicensingAgenciesSelector,
  getCommunityCareLicensingAgenciesSelector,
} from 'selectors/countyAgenciesSelectors'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CrossReportForm from 'screenings/CrossReportForm'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import * as crossReportActions from 'actions/crossReportFormActions'
import {saveScreening} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {getScreeningWithEditsSelector} from 'selectors/crossReportFormSelectors'

const mapStateToProps = (state) => ({
  counties: state.get('counties').toJS(),
  county_id: state.getIn(['crossReportForm', 'county_id', 'value']),
  countyAgencies: {
    [DEPARTMENT_OF_JUSTICE]: getDepartmentOfJusticeAgenciesSelector(state).toJS(),
    [DISTRICT_ATTORNEY]: getDistrictAttorneyAgenciesSelector(state).toJS(),
    [LAW_ENFORCEMENT]: getLawEnforcementAgenciesSelector(state).toJS(),
    [COMMUNITY_CARE_LICENSING]: getCommunityCareLicensingAgenciesSelector(state).toJS(),
    [COUNTY_LICENSING]: getCountyLicensingAgenciesSelector(state).toJS(),
  },
  hasAgencies: Object.keys(AGENCY_TYPES).reduce((result, key) => result || state.getIn(['crossReportForm', key, 'selected']), false),
  inform_date: state.getIn(['crossReportForm', 'inform_date', 'value']),
  method: state.getIn(['crossReportForm', 'method', 'value']),
  districtAttorney: state.getIn(['crossReportForm', DISTRICT_ATTORNEY]).toJS(),
  departmentOfJustice: state.getIn(['crossReportForm', DEPARTMENT_OF_JUSTICE]).toJS(),
  lawEnforcement: state.getIn(['crossReportForm', LAW_ENFORCEMENT]).toJS(),
  countyLicensing: state.getIn(['crossReportForm', COUNTY_LICENSING]).toJS(),
  communityCareLicensing: state.getIn(['crossReportForm', COMMUNITY_CARE_LICENSING]).toJS(),
  screening: getScreeningSelector(state).toJS(),
  screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
})
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...crossReportActions,
    saveScreening,
    fetchCountyAgencies,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CrossReportForm)
