import PropTypes from 'prop-types'
import React from 'react'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import ShowField from 'common/ShowField'
import {dateTimeFormatter} from 'utils/dateFormatter'

const ScreeningInformationShowView = ({errors, screening}) => (
  <div className='card-body'>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Title/Name of Screening'>
        {screening.get('name')}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Assigned Social Worker'
        errors={errors.assignee} required
      >
        {screening.get('assignee')}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Screening Start Date/Time' errors={errors.started_at} required>
        {dateTimeFormatter(screening.get('started_at'))}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Screening End Date/Time' errors={errors.ended_at}>
        {dateTimeFormatter(screening.get('ended_at'))}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Communication Method'
        errors={errors.communication_method} required
      >
        {COMMUNICATION_METHOD[screening.get('communication_method')]}
      </ShowField>
    </div>
  </div>
)

ScreeningInformationShowView.propTypes = {
  errors: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

export default ScreeningInformationShowView
