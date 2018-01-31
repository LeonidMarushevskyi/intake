import {connect} from 'react-redux'
import HistoryTable from 'views/history/HistoryTable'
import {
  getFormattedCasesSelector,
  getFormattedReferralsSelector,
} from 'selectors/screening/historyOfInvolvementSelectors'
import * as IntakeConfig from 'common/config'

const mapStateToProps = (state) => ({
  showCopyButton: IntakeConfig.jsClipboardSupported(),
  cases: getFormattedCasesSelector(state).toJS(),
  referrals: getFormattedReferralsSelector(state).toJS(),
  screenings: [],
  // To make the copied table fit in MS Word, we have to temporarily resize it.
  onCopy: (copyContent) => {
    copyContent.style.width = '1%'
    return copyContent
  },
  onSuccess: (copyContent) => {
    copyContent.style.width = null
  },
  onError: (copyContent) => {
    copyContent.style.width = null
  },
})

export default connect(mapStateToProps)(HistoryTable)
