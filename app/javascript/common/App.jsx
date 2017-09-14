import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import * as systemCodesActions from 'actions/systemCodesActions'
import {bindActionCreators} from 'redux'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetch()
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
}
const mapStateToProps = (_state, _ownProps) => ({})
const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators(systemCodesActions, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
