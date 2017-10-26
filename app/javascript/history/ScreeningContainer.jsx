import {connect} from 'react-redux'
import ScreeningView from 'history/ScreeningView'
import {
  getScreeningAtIndexSelector,
  getPeopleNamesSelector,
  getReporterNameSelector,
  getWorkerNameSelector,
  getCountyNameSelector,
  getStatusSelector,
} from 'selectors/historyOfInvolvementScreeningSelectors'

const mapStateToProps = (state, {index}) => {
  const screening = getScreeningAtIndexSelector(state, index)
  return {
    endDate: screening.get('end_date', ''),
    startDate: screening.get('start_date', ''),
    status: getStatusSelector(state, index),
    county: getCountyNameSelector(state, index),
    people: getPeopleNamesSelector(state, index),
    reporter: getReporterNameSelector(state, index),
    worker: getWorkerNameSelector(state, index),
  }
}

export default connect(mapStateToProps)(ScreeningView)
