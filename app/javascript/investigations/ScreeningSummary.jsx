import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

const ScreeningSummary = ({
  screeningId,
  name,
  responseTime,
  allegations,
  safetyAlerts,
  safetyInformation,
  decisionRationale,
  loaded,
}) => {
  let cardBody
  if (loaded) {
    cardBody = (<div className='card-body'>
      <div className='row'>
        <div className='col-md-4'>
          <label>Name</label>
          <Link to={`/screenings/${screeningId}`}>{name}</Link>
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
    </div>)
  } else {
    cardBody = (<div/>)
  }
  return (
    <div className='card show double-gap-top'>
      <div className='card-header'>
        <span>Screening Summary</span>
      </div>
      {cardBody}
    </div>
  )
}

ScreeningSummary.propTypes = {
  allegations: PropTypes.array,
  decisionRationale: PropTypes.string,
  id: PropTypes.string,
  loaded: PropTypes.bool,
  name: PropTypes.string,
  params: PropTypes.object,
  responseTime: PropTypes.string,
  safetyAlerts: PropTypes.array,
  safetyInformation: PropTypes.string,
  screeningId: PropTypes.string,
}
ScreeningSummary.defaultProps = {
  allegations: [],
  safetyAlerts: [],
}
export default ScreeningSummary
