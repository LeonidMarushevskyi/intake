import React from 'react'
import PropTypes from 'prop-types'
import {dateRangeFormatter} from 'utils/dateFormatter'

const ScreeningView = ({startDate, endDate, status, county, people, reporter, worker}) => (
  <tr>
    <td>{dateRangeFormatter({start_date: startDate, end_date: endDate})}</td>
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
  endDate: PropTypes.string,
  people: PropTypes.string,
  reporter: PropTypes.string,
  startDate: PropTypes.string,
  status: PropTypes.string,
  worker: PropTypes.string,
}

export default ScreeningView
