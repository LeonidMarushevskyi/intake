import InvestigationContact from 'investigations/InvestigationContact'
import {connect} from 'react-redux'

const mapStateToProps = (_state, ownProps) => (
  {investigationId: ownProps.params.investigation_id}
)

export default connect(mapStateToProps)(InvestigationContact)
