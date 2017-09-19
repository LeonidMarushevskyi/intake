import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from '../enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from '../enums/ScreeningDecisionOptions'
import moment from 'moment'
import {Link} from 'react-router'
import {isFeatureActive} from 'common/config'

const ScreeningRow = ({id, name, decision, decisionDetail, assignee, startedAt, referralId}) => {
  const screeningStatus = (decision, decisionDetail) => {
    if (['promote_to_referral', 'screen_out'].includes(decision)) {
      const responseTimes = SCREENING_DECISION_OPTIONS[decision]
      return responseTimes.values[decisionDetail]
    } else {
      return SCREENING_DECISION[decision]
    }
  }
  const linkName = (id, referralId, name) => {
    if (name) {
      return name
    } else if (referralId) {
      return referralId
    } else {
      return id
    }
  }
  const linkPath = (id, referralId) => {
    if (referralId && isFeatureActive('investigations')) {
      return `/investigations/${referralId}`
    } else {
      return `/screenings/${id}`
    }
  }
  return (
    <tr>
      <td><Link to={linkPath(id, referralId)}>{linkName(id, referralId, name)}</Link></td>
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
  referralId: PropTypes.string,
  startedAt: PropTypes.string,
}
export default ScreeningRow
