import {connect} from 'react-redux'
import HistoryOfInvolvement from 'history/HistoryOfInvolvement'
import {getHistoryIsEmptySelector} from 'selectors/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {historyIsEmpty: getHistoryIsEmptySelector(state)}
)

export default connect(mapStateToProps)(HistoryOfInvolvement)
