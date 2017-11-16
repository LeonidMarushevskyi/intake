import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import * as systemCodesActions from 'actions/systemCodesActions'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetch()
  }
  render() {
    const hasRemoteError = this.props.remoteError && Object.keys(this.props.remoteError).length > 0
    return (
      <div className={ClassNames({'page-has-error': hasRemoteError})}>
        {hasRemoteError && <PageError />}
        {this.props.children}
      </div>
    )
  }
}
App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  remoteError: PropTypes.object,
}
const mapStateToProps = (state, _ownProps) => ({
  remoteError: state.getIn(['remoteError']).toJS(),
})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(systemCodesActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
