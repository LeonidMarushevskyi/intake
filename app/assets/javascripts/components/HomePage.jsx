import * as screeningActions from 'actions/screeningActions'
import React from 'react'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

export class HomePage extends React.Component {
  constructor() {
    super(...arguments)
    this.createScreening = this.createScreening.bind(this)
  }

  createScreening() {
    this.props.actions.createScreening().then(() => {
      const {screening} = this.props
      browserHistory.push({
        pathname: `/screenings/${screening.get('id')}/edit`,
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        <a href='#' className='row' onClick={() => { this.createScreening() }}>Start Screening</a>
        <Link to='/people/new' className='row'>Create Person</Link>
        <Link to='/screenings' className='row'>Screenings</Link>
      </div>
    )
  }
}

HomePage.propTypes = {
  actions: React.PropTypes.object.isRequired,
  screening: React.PropTypes.object.isRequired,
}

function mapStateToProps(state, _ownProps) {
  return {screening: state.screening}
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
