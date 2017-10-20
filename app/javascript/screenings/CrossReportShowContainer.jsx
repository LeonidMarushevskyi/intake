import {connect} from 'react-redux'
import CrossReportShow from 'screenings/CrossReportShow'
import {getCrossReportSelector, getSelectedCrossReportAgencyNamesSelector} from 'selectors/crossReportShowSelectors'

const mapStateToProps = (state) => {
  const firstCrossReport = getCrossReportSelector(state)
  return {
    agencies: getSelectedCrossReportAgencyNamesSelector(state).toJS(),
    reportedOn: firstCrossReport.get('inform_date'),
    communicationMethod: firstCrossReport.get('method'),
    county: firstCrossReport.get('county_id'),
  }
}

export default connect(mapStateToProps)(CrossReportShow)
