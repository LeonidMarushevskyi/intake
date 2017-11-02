import {connect} from 'react-redux'
import HistoryTable from 'history/HistoryTable'
import {
  getFormattedCasesSelector,
  getReferralsCountSelector,
  getFormattedScreeningsSelector,
} from 'selectors/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {
    cases: getFormattedCasesSelector(state).toJS(),
    referrals: [],
    screenings: getFormattedScreeningsSelector(state).toJS(),
  }
)

export default connect(mapStateToProps)(HistoryTable)
