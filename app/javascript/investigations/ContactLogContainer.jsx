import ContactLog from 'investigations/ContactLog'
import {connect} from 'react-redux'

const mapStateToProps = (_state, ownProps) => (
  {id: ownProps.params.id}
)

export default connect(mapStateToProps)(ContactLog)
