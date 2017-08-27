import * as screeningActions from 'actions/screeningActions'
import {get} from 'utils/http'
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
    this.getScreenings = this.getScreenings.bind(this)
    this.state = {screenings: []}
  }

  componentDidMount() {
    if (IntakeConfig.isFeatureInactive('release_two')) {
      this.getScreenings()
    }
  }

  componentWillReceiveProps(nextProps) {
    const newScreeningId = nextProps.screening.get('id')
    const oldScreeningId = this.props.screening.get('id')
    if (newScreeningId && newScreeningId !== oldScreeningId) {
      this.props.router.push({pathname: `/screenings/${newScreeningId}/edit`})
    }
  }

  getScreenings() {
    get('/api/v1/screenings').then((screenings) => this.setState({screenings}))
  }

  render() {
    return (
      <div className='row gap-top'>
        <div className='col-md-3'>
          <ul className='unstyled-list'>
            <li className='half-pad-top'>
              <Link to='#' className='row' onClick={() => { this.props.actions.createScreening() }}>Start Screening</Link>
            </li>
          </ul>
        </div>
        <div className='col-md-9'>
          { IntakeConfig.isFeatureInactive('release_two') && <ScreeningsTable screenings={this.state.screenings} /> }
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {
    screening: state.get('screening'),
    router: ownProps.router,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
