import {connect} from 'react-redux'
import CrossReportShow from 'screenings/crossReports/CrossReportShow'
import {
  getCrossReportSelector,
  getErrorsSelector,
  getSelectedCrossReportAgencyNamesSelector,
} from 'selectors/crossReportShowSelectors'

const mapStateToProps = (state) => {
  const firstCrossReport = getCrossReportSelector(state)
  return {
    agencies: getSelectedCrossReportAgencyNamesSelector(state).toJS(),
    areCrossReportsRequired: false,
    alertInfoMessage: '',
    communicationMethod: firstCrossReport.get('method'),
    errors: getErrorsSelector(state).toJS(),
    hasAgencies: getSelectedCrossReportAgencyNamesSelector(state).size !== 0,
    hasCrossReport: state.getIn(['screening', 'cross_reports']).size !== 0,
    reportedOn: firstCrossReport.get('inform_date'),
    requiredCrossReportErrors: [],
  }
}

export default connect(mapStateToProps)(CrossReportShow)
