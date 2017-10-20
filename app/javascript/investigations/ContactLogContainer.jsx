import ContactLog from 'investigations/ContactLog'
import {connect} from 'react-redux'

const mapStateToProps = (_state, ownProps) => (
  {id: ownProps.id}
)

export default connect(mapStateToProps)(ContactLog)
