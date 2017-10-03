import PropTypes from 'prop-types'
import React from 'react'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'
import {dateRangeFormatter} from 'utils/dateFormatter'

const HistoryCardCase = ({hoiCase, index}) => {
  let status = hoiCase.get('end_date') ? 'Closed' : 'Open'
  const serviceComponent = hoiCase.get('service_component')
  if (serviceComponent) {
    status += ` - ${serviceComponent}`
  }

  const incidentCounty = hoiCase.get('county_name')
  const assignee = hoiCase.get('assigned_social_worker')
  const legacyDescriptor = hoiCase.get('legacy_descriptor')
  const caseId = legacyDescriptor ? legacyDescriptor.get('legacy_ui_id') : ''
  const accessLimitation = hoiCase.get('access_limitation')
  const limitedAccessCode = accessLimitation ? accessLimitation.get('limited_access_code') : 'N'
  const accessNotification = accessDescription(limitedAccessCode)

  const focusChild = hoiCase.get('focus_child')

  const parentNames = []
  const parents = hoiCase.get('parents') || []
  parents.forEach((parent) =>
    parentNames.push(nameFormatter(parent.toJS()))
  )

  return (
    <tr key={`case-${index}`} id={`case-${hoiCase.get('id')}`}>
      <td>{dateRangeFormatter(hoiCase.toJS())}</td>
      <td>
        <div className='row'>Case</div>
        <div className='row'>{caseId}</div>
        <div className='row'>{`(${status})`}</div>
        {accessNotification && <div className='row information-flag'>{accessNotification}</div>}
      </td>
      <td>{incidentCounty}</td>
      <td>
        <div className='row'>
          <span className='focus-child'>
            {`Focus Child: ${focusChild ? nameFormatter(focusChild.toJS()) : ''}`}
          </span>
        </div>
        <div className='row'>
          <span className='parents'>
            {`Parent(s): ${parentNames.join(', ')}`}
          </span>
        </div>
        <div className='row'>
          <span className='assignee'>
            {`Worker: ${assignee ? nameFormatter(Object.assign(assignee.toJS(), {name_default: ''})) : ''}`}
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

