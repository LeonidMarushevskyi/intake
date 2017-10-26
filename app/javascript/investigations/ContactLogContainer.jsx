import ContactLog from 'investigations/ContactLog'
import {getContactLogsSelector} from 'selectors/contactLogSelectors'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  const contactLogs = getContactLogsSelector(state).toJS()
  return {
    investigationId: ownProps.id,
    contactLogs,
  }
}

export default connect(mapStateToProps)(ContactLog)
