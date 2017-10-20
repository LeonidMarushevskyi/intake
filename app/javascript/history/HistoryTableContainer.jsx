import {connect} from 'react-redux'
import HistoryTable from 'history/HistoryTable'
import {
  getCasesCountSelector,
  getReferralsCountSelector,
  getScreeningsCountSelector,
} from 'selectors/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {
    casesCount: getCasesCountSelector(state),
    referralsCount: getReferralsCountSelector(state),
    screeningsCount: getScreeningsCountSelector(state),
  }
)

export default connect(mapStateToProps)(HistoryTable)
