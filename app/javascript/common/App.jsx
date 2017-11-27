import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import * as systemCodesActions from 'actions/systemCodesActions'
import {
  getHasGenericErrorValueSelector,
  getTotalScreeningSubmissionErrorValueSelector,
} from 'selectors/errorsSelectors'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetch()
  }
  render() {
    const {errorCount, hasError} = this.props
    return (
      <div>
        {(hasError) && <PageError errorCount={errorCount} />}
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
}
const mapStateToProps = (state, {errorCount}) => ({
  errorCount: getTotalScreeningSubmissionErrorValueSelector(state),
  hasError: getHasGenericErrorValueSelector(state) || Boolean(errorCount),
})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(systemCodesActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
