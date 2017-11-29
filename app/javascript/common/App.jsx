import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {
  getHasGenericErrorValueSelector,
  getTotalScreeningSubmissionErrorValueSelector,
} from 'selectors/errorsSelectors'
import {getUserNameSelector} from 'selectors/userInfoSelectors'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {fetch as fetchUserInfoAction} from 'actions/userInfoActions'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'
import {GlobalHeader} from 'react-wood-duck'
import userNameFormatter from 'utils/userNameFormatter'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSystemCodesAction()
    this.props.actions.fetchUserInfoAction()
  }

  render() {
    const {errorCount, hasError, fullName} = this.props
    return (
      <div>
        <GlobalHeader profileName={fullName} />
        {(hasError) && <PageError errorCount={errorCount} />}
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  errorCount: PropTypes.number,
  fullName: PropTypes.string,
  hasError: PropTypes.bool,
}
const mapStateToProps = (state) => ({
  errorCount: getTotalScreeningSubmissionErrorValueSelector(state),
  hasError: getHasGenericErrorValueSelector(state) || Boolean(getTotalScreeningSubmissionErrorValueSelector(state)),
  fullName: userNameFormatter(getUserNameSelector(state)),
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({
    fetchSystemCodesAction,
    fetchUserInfoAction,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
