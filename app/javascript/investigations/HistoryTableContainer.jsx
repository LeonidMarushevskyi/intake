import {connect} from 'react-redux'
import HistoryTable from 'views/history/HistoryTable'
import {
  getFormattedCasesSelector,
  getFormattedReferralsSelector,
  getFormattedScreeningsSelector,
} from 'selectors/investigation/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {
    cases: getFormattedCasesSelector(state).toJS(),
    referrals: getFormattedReferralsSelector(state).toJS(),
    screenings: getFormattedScreeningsSelector(state).toJS(),
  }
)

export default connect(mapStateToProps)(HistoryTable)
