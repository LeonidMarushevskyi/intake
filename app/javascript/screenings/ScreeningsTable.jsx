import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from '../enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from '../enums/ScreeningDecisionOptions'
import moment from 'moment'
import {Link} from 'react-router'

const ScreeningsTable = ({screenings}) => (
  <div className='table-responsive'>
    <table className='table table-hover'>
      <thead>
        <tr>
          <th className='col-md-3' scope='col'>Screening Name</th>
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
            const responseTimes = SCREENING_DECISION_OPTIONS[screening.screening_decision]
            const screeningDecision =
              (['promote_to_referral', 'screen_out'].includes(screening.screening_decision)) ?
                responseTimes.values[screening.screening_decision_detail] :
                SCREENING_DECISION[screening.screening_decision]
            return (
              <tr key={screening.id}>
                <td><Link to={`/screenings/${screening.id}`}>{screeningName}</Link></td>
                <td>{screeningDecision}</td>
                <td>&nbsp;</td>
                <td>{screening.assignee}</td>
                <td>
                  {moment(screening.started_at).format('L LT')} <br/>
                  <em className='text-muted'>({moment(screening.started_at).fromNow()})</em>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  </div>
)

ScreeningsTable.propTypes = {
  screenings: PropTypes.array,
}

ScreeningsTable.defaultProps = {
  screenings: [],
}
export default ScreeningsTable
