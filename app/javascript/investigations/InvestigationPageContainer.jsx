import * as actions from 'actions/investigationActions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getInvestigationTitleSelector} from 'selectors/investigation/investigationSelectors'
import InvestigationPage from 'investigations/InvestigationPage'

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.params.id,
  pageTitle: getInvestigationTitleSelector(state),
})

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(InvestigationPage)
