import PropTypes from 'prop-types'
import React from 'react'
import nameFormatter from 'utils/nameFormatter'
import {dateRangeFormatter} from 'utils/dateFormatter'

const HistoryCardCase = ({hoiCase, index}) => {
  const status = hoiCase.get('end_date') ? 'Closed' : 'Open'
  const incidentCounty = hoiCase.get('county_name')
  const assignee = hoiCase.get('assigned_social_worker')

  const focusChild = hoiCase.get('focus_child')

  const parentNames = []
  const parents = hoiCase.get('parents') || []
  parents.forEach((parent) =>
    parentNames.push(nameFormatter(parent))
  )

  return (
    <tr key={`case-${index}`}>
      <td>{dateRangeFormatter(hoiCase)}</td>
      <td>
        <div className='row'>Case</div>
        <div className='row'>{`(${status})`}</div>
      </td>
      <td>{incidentCounty}</td>
      <td>
        <div className='row'>
          <span className='focus-child'>
            {`Focus Child: ${focusChild ? nameFormatter(focusChild) : ''}`}
          </span>
        </div>
        <div className='row'>
          <span className='parents'>
            {`Parent(s): ${parentNames.join(', ')}`}
          </span>
        </div>
        <div className='row'>
          <span className='assignee'>
            {`Worker: ${assignee ? nameFormatter(assignee, {name_default: ''}) : ''}`}
          </span>
        </div>
      </td>
    </tr>
  )
}

HistoryCardCase.propTypes = {
  hoiCase: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

export default HistoryCardCase

