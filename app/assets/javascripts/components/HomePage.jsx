import * as screeningActions from 'actions/screeningActions'
import * as Utils from 'utils/http'
import React from 'react'
import ScreeningsTable from 'components/screenings/ScreeningsTable'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

export class HomePage extends React.Component {
  constructor() {
    super(...arguments)
    this.createScreening = this.createScreening.bind(this)
    this.getScreenings = this.getScreenings.bind(this)
    this.state = {screenings: []}
  }

  componentDidMount() {
    this.getScreenings()
  }

  createScreening() {
    this.props.actions.createScreening().then(() => {
      const {screening} = this.props
      browserHistory.push({
        pathname: `/screenings/${screening.get('id')}/edit`,
      })
    })
  }

  getScreenings() {
    Utils.request('GET', '/api/v1/screenings')
      .then((jsonResponse) => this.setState({screenings: jsonResponse}))
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-3'>
          <h1>Home</h1>
          <a href='#' className='row' onClick={() => { this.createScreening() }}>Start Screening</a>
          <Link to='/people/new' className='row'>Create Person</Link>
        </div>
        <div className='col-md-6'>
          <ScreeningsTable screenings={this.state.screenings} />
        </div>
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
