import PropTypes from 'prop-types'
import React from 'react'
import COMMUNICATION_METHOD from 'CommunicationMethod'
import EditLink from 'components/common/EditLink'
import moment from 'moment'
import ShowField from 'components/common/ShowField'

function parseDateTime(dateTime) {
  return (dateTime === null ? '' : moment.utc(dateTime).format('MM/DD/YYYY hh:mm A'))
}

const ScreeningInformationShowView = ({screening, onEdit}) => (
  <div className='card show double-gap-top' id='screening-information-card'>
    <div className='card-header'>
      <span>Screening Information</span>
      <EditLink ariaLabel='Edit screening information' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Title/Name of Screening'>
          {screening.get('name')}
        </ShowField>
        <ShowField gridClassName='col-md-6' label='Assigned Social Worker' required>
          {screening.get('assignee')}
        </ShowField>
      </div>
      <div className='row double-gap-top'>
        <ShowField gridClassName='col-md-6' label='Screening Start Date/Time' required>
          {parseDateTime(screening.get('started_at'))}
        </ShowField>
        <ShowField gridClassName='col-md-6' label='Screening End Date/Time'>
          {parseDateTime(screening.get('ended_at'))}
        </ShowField>
      </div>
      <div className='row double-gap-top'>
        <ShowField gridClassName='col-md-6' label='Communication Method' required>
          {COMMUNICATION_METHOD[screening.get('communication_method')]}
        </ShowField>
      </div>
    </div>
  </div>
)

ScreeningInformationShowView.propTypes = {
  onEdit: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}

export default ScreeningInformationShowView
