import {connect} from 'react-redux'
import ReferralView from 'history/ReferralView'
import {
  getStartDateSelector,
  getEndDateSelector,
  getReferralIdSelector,
  getNotificationSelector,
  getCountySelector,
  getPeopleAndRolesSelector,
  getStatusAndResponseTimeSelector,
} from 'selectors/historyOfInvolvementReferralSelectors'

const mapStateToProps = (state, {index}) => (
  {
    startDate: getStartDateSelector(state, index),
    endDate: getEndDateSelector(state, index),
    referralId: getReferralIdSelector(state, index),
    status: getStatusAndResponseTimeSelector(state, index),
    notification: getNotificationSelector(state, index),
    county: getCountySelector(state, index),
    peopleAndRoles: getPeopleAndRolesSelector(state, index).toJS(),
  }
)

export default connect(mapStateToProps)(ReferralView)
