import {connect} from 'react-redux'
import HistoryTable from 'history/HistoryTable'
import {
  getCasesCountSelector,
  getReferralsCountSelector,
  getScreeningsCountSelector,
} from 'selectors/historyOfInvolvementSelectors'

const mapStateToProps = (state) => (
  {
    'case': [],
    referrals: [],
    screenings: [],
  }
)

export default connect(mapStateToProps)(HistoryTable)
