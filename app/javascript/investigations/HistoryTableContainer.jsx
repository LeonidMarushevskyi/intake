import {connect} from 'react-redux'
import HistoryTable from 'history/HistoryTable'
import {
  getFormattedCasesSelector,
  getReferralsCountSelector,
  getScreeningsCountSelector,
} from 'selectors/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {
    cases: getFormattedCasesSelector(state).toJS(),
    referrals: [],
    screenings: [],
  }
)

export default connect(mapStateToProps)(HistoryTable)
