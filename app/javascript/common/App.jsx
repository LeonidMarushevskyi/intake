import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {
  getHasGenericErrorValueSelector,
  getTotalScreeningSubmissionErrorValueSelector,
} from 'selectors/errorsSelectors'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {fetch as fetchUserInfoAction} from 'actions/userInfoActions'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'
import {GlobalHeader} from 'react-wood-duck'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSystemCodesAction()
    this.props.actions.fetchUserInfoAction()
  }
  render() {
    const {errorCount, hasError} = this.props
    return (
      <div>
        {(hasError) && <PageError errorCount={errorCount} />}
        <GlobalHeader profileName='Will Robinson'/>
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  errorCount: PropTypes.number,
  hasError: PropTypes.bool,
  userInfo: PropTypes.object,
}
const mapStateToProps = (state) => ({
  errorCount: getTotalScreeningSubmissionErrorValueSelector(state),
  hasError: getHasGenericErrorValueSelector(state) || Boolean(getTotalScreeningSubmissionErrorValueSelector(state)),
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({
    fetchSystemCodesAction,
    fetchUserInfoAction,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
