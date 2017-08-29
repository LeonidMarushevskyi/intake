import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from '../enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from '../enums/ScreeningDecisionOptions'
import moment from 'moment'
import {Link} from 'react-router'

const ScreeningRow = ({id, name, decision, decisionDetail, assignee, startedAt}) => {
  const screeningStatus = (decision, decisionDetail) => {
    if (['promote_to_referral', 'screen_out'].includes(decision)) {
      const responseTimes = SCREENING_DECISION_OPTIONS[decision]
      return responseTimes.values[decisionDetail]
    } else {
      return SCREENING_DECISION[decision]
    }
  }
  const screeningName = name ? name : id
  return (
    <tr>
      <td><Link to={`/screenings/${id}`}>{screeningName}</Link></td>
      <td>{screeningStatus(decision, decisionDetail)}</td>
      <td>&nbsp;</td>
      <td>{assignee}</td>
      <td>
        {moment(startedAt).format('L LT')} <br/>
        <em className='text-muted'>({moment(startedAt).fromNow()})</em>
      </td>
    </tr>
  )
}

ScreeningRow.propTypes = {
  assignee: PropTypes.string,
  decision: PropTypes.string,
  decisionDetail: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  startedAt: PropTypes.string,
}
export default ScreeningRow
