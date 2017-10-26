import ContactLog from 'investigations/ContactLog'
import {connect} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    investigationId: ownProps.id,
    contactLogs: state.getIn(['investigation', 'contacts']).toJS(),
  }
}

export default connect(mapStateToProps)(ContactLog)
