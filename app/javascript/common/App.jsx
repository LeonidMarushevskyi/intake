import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import * as systemCodesActions from 'actions/systemCodesActions'
import {getHasGenericErrorValueSelector} from 'selectors/errorsSelectors'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetch()
  }
  render() {
    const {hasGenericError} = this.props
    return (
      <div className={ClassNames({'page-has-error': hasGenericError})}>
        {hasGenericError && <PageError />}
        {this.props.children}
      </div>
    )
  }
}
App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  hasGenericError: PropTypes.bool,
}
const mapStateToProps = (state, _ownProps) => ({
  hasGenericError: getHasGenericErrorValueSelector(state),
})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(systemCodesActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
