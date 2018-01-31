import {connect} from 'react-redux'
import HistoryOfInvolvement from 'views/history/HistoryOfInvolvement'
import {getHistoryIsEmptySelector} from 'selectors/screening/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {historyIsEmpty: getHistoryIsEmptySelector(state)}
)

export default connect(mapStateToProps)(HistoryOfInvolvement)
