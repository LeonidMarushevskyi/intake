// import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CrossReportShow from 'screenings/CrossReportShow'
// import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {getAgencyCodeToName} from 'selectors/countyAgenciesSelectors'

const mapStateToProps = (state, _ownProps) => {
  const firstCrossReport = state.getIn(['screening', 'cross_reports', 0])
  return {
    agencyCodeToName: getAgencyCodeToName(state),
    agencies: firstCrossReport.get('agencies').toJS(),
    reportedOn: firstCrossReport.get('inform_date'),
    communicationMethod: firstCrossReport.get('method'),
    county: firstCrossReport.get('county_id'),
  }
}
const mapDispatchToProps = (_dispatch, _ownProps) => ({
  // actions: bindActionCreators({fetchCountyAgencies}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CrossReportShow)
