import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from '../enums/ScreeningDecision'
import moment from 'moment'
import {Link} from 'react-router'

const ScreeningsTable = ({screenings}) => {
  return (
    <div className='table-responsive'>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th scope='col'>Screening Name</th>
            <th scope='col'>Type/Decision</th>
            <th scope='col'>Status</th>
            <th scope='col'>Assignee</th>
            <th scope='col'>Report Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {
            screenings.map((screening) => {
              const screeningName = screening.name ? screening.name : screening.id
              return (
                <tr key={screening.id}>
                  <td><Link to={`/screenings/${screening.id}`}>{screeningName}</Link></td>
                  <td>{SCREENING_DECISION[screening.screening_decision]}</td>
                  <td>&nbsp;</td>
                  <td>{screening.assignee}</td>
                  <td>{moment(screening.started_at).format('MM/DD/YYYY')}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

ScreeningsTable.propTypes = {
  screenings: PropTypes.array,
}

ScreeningsTable.defaultProps = {
  screenings: [],
}
export default ScreeningsTable
