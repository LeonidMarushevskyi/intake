import {connect} from 'react-redux'
import HistoryTable from 'views/history/HistoryTable'
import {
  getFormattedCasesSelector,
  getFormattedReferralsSelector,
  getFormattedScreeningsSelector,
} from 'selectors/investigation/historyOfInvolvementSelectors'
import * as IntakeConfig from 'common/config'

const mapStateToProps = (state) => (
  {
    showCopyButton: IntakeConfig.jsClipboardSupported(),
    cases: getFormattedCasesSelector(state).toJS(),
    referrals: getFormattedReferralsSelector(state).toJS(),
    screenings: getFormattedScreeningsSelector(state).toJS(),
  }
)

export default connect(mapStateToProps)(HistoryTable)
