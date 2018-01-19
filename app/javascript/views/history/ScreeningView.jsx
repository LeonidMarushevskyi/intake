import React from 'react'
import PropTypes from 'prop-types'

const ScreeningView = ({dateRange, status, county, people, reporter, worker}) => (
  <tr>
    <td>{dateRange}</td>
    <td>
      <div className='semibold'>Screening</div>
      <div>({status})</div>
    </td>
    <td>{county}</td>
    <td>
      <div className='people'>{people}</div>
      <div className='reporter'><span>Reporter:</span> {reporter}</div>
      <div className='worker'><span>Worker:</span> {worker}</div>
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
