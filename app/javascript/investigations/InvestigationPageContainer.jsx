import * as actions from 'actions/investigationActions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import InvestigationPage from 'investigations/InvestigationPage'

const mapStateToProps = (_state, ownProps) => (
  {id: ownProps.params.id}
)

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(InvestigationPage)
