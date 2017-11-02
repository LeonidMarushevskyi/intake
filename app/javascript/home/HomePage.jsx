import * as screeningActions from 'actions/screeningActions'
import {fetch as fetchScreenings} from 'actions/screeningsActions'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningsTable from 'screenings/ScreeningsTable'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as IntakeConfig from 'common/config'

export class HomePage extends React.Component {
  constructor() {
    super(...arguments)
  }

  componentDidMount() {
    if (IntakeConfig.isFeatureInactive('release_two')) {
      this.props.actions.fetchScreenings()
    }
  }

  render() {
    return (
      <div className='row gap-top'>
        <div className='col-md-3'>
          <Link to='#' onClick={() => { this.props.actions.createScreening() }}>Start Screening</Link>
        </div>
        <div className='col-md-9'>
          { IntakeConfig.isFeatureInactive('release_two') && <ScreeningsTable screenings={this.props.screenings} /> }
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  screenings: PropTypes.array,
}

function mapStateToProps(state, _ownProps) {
  return {
    screenings: state.get('screenings').toJS(),
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = Object.assign({}, screeningActions, {fetchScreenings})
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
