import InvestigationContact from 'investigations/InvestigationContact'
import {connect} from 'react-redux'
import * as actions from 'actions/contactActions'
import {bindActionCreators} from 'redux'

const mapStateToProps = (state, ownProps) => ({
  investigationId: ownProps.params.investigation_id,
  contact: state.get('contact').toJS(),
})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(InvestigationContact)
