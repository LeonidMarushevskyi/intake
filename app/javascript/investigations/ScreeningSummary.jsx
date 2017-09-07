import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

export class ScreeningSummary extends React.Component {
  componentDidMount() {
    const {actions, params: {id}} = this.props
    actions.fetch(id)
  }

  render() {
    const {
      id,
      name,
      responseTime,
      allegations,
      safetyAlerts,
      safetyInformation,
      decisionRationale,
    } = this.props
    return (
      <div className='card show double-gap-top'>
        <div className='card-header'>
          <span>Screening Summary</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-4'>
              <label>Name</label>
              <Link to={`/screenings/${id}`}>{name}</Link>
            </div>
            <div className='col-md-4'>
              <label>Response Time</label>
              {responseTime}
            </div>
            <div className='col-md-4'>
              <label>Allegations</label>
              {allegations.join(', ')}
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4'>
              <label>Alerts</label>
              <ul>
                {safetyAlerts.map((alert) => <li key={alert}>{alert}</li>)}
              </ul>
            </div>
            <div className='col-md-8'>
              <label>Safety Information</label>
              {safetyInformation}
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <label>Decision Rationale</label>
              {decisionRationale}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ScreeningSummary.propTypes = {
  actions: PropTypes.object,
  allegations: PropTypes.array,
  decisionRationale: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  params: PropTypes.object,
  responseTime: PropTypes.string,
  safetyAlerts: PropTypes.array,
  safetyInformation: PropTypes.string,
}
ScreeningSummary.defaultProps = {
  allegations: [],
  safetyAlerts: [],
}
export default ScreeningSummary
