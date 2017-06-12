import * as screeningActions from 'actions/screeningActions'
import * as Utils from 'utils/http'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningsTable from 'components/screenings/ScreeningsTable'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as IntakeConfig from 'config'

export class HomePage extends React.Component {
  constructor() {
    super(...arguments)
    this.createScreening = this.createScreening.bind(this)
    this.getScreenings = this.getScreenings.bind(this)
    this.state = {screenings: []}
  }

  componentDidMount() {
    if (IntakeConfig.isFeatureInactive('release_two')) {
      this.getScreenings()
    }
  }

  createScreening() {
    this.props.actions.createScreening().then(() => {
      const {screening} = this.props
      this.props.router.push({
        pathname: `/screenings/${screening.get('id')}/edit`,
      })
    })
  }

  getScreenings() {
    Utils.request('GET', '/api/v1/screenings')
      .then((jsonResponse) => {
        this.setState({screenings: jsonResponse})
      }
    )
  }

  render() {
    return (
      <div className='row gap-top'>
        <div className='col-md-3'>
          <ul className='unstyled-list'>
            <li className='half-pad-top'>
              <Link to='#' className='row' onClick={() => { this.createScreening() }}>Start Screening</Link>
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
    screening: state.screening,
    router: ownProps.router,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
