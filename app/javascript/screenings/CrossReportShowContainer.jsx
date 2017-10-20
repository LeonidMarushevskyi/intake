import {connect} from 'react-redux'
import CrossReportShow from 'screenings/CrossReportShow'
import {getCrossReport, getSelectedCrossReportAgencyNames} from 'selectors/crossReportShowSelectors'

const mapStateToProps = (state) => {
  const firstCrossReport = getCrossReport(state)
  return {
    agencies: getSelectedCrossReportAgencyNames(state).toJS(),
    reportedOn: firstCrossReport.get('inform_date'),
    communicationMethod: firstCrossReport.get('method'),
    county: firstCrossReport.get('county_id'),
  }
}

export default connect(mapStateToProps)(CrossReportShow)
