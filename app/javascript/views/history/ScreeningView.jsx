import React from 'react'
import PropTypes from 'prop-types'

const ScreeningView = ({dateRange, status, county, people, reporter, worker}) => (
  <tr>
    <td>{dateRange}</td>
    <td>
      <div className='row'>Screening</div>
      <div className='row'>({status})</div>
    </td>
    <td>{county}</td>
    <td>
      <div className='row'>
        <span className='col-md-12 people'>{people}</span>
      </div>
      <div className='row'>
        <span className='col-md-6 reporter'>Reporter: {reporter}</span>
        <span className='col-md-6 worker'>Worker: {worker}</span>
      </div>
    </td>
  </tr>
)

ScreeningView.propTypes = {
  county: PropTypes.string,
  dateRange: PropTypes.string,
  people: PropTypes.string,
  reporter: PropTypes.string,
  status: PropTypes.string,
  worker: PropTypes.string,
}

export default ScreeningView
