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
    const hasRemoteError = this.props.remoteError && !this.props.remoteError.isEmpty()
    const wrapperClass = hasRemoteError ? 'page-has-remote-error' : ''
    return (
      <div className={wrapperClass}>
        { hasRemoteError &&
          <PageError messageObject={this.props.remoteError}/>
        }
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
const mapStateToProps = (_state, _ownProps) => ({
  remoteError: _state.getIn(['remoteError']),
})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(systemCodesActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
