import COUNTIES from 'enums/Counties'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'
import US_STATE from 'enums/USState'
import {dateFormatter} from 'utils/dateFormatter'

const IncidentInformationShowView = ({screening, errors}) => {
  const incidentDate = dateFormatter(screening.get('incident_date'))
  const state = US_STATE.find((state) => state.code === screening.getIn(['address', 'state']))

  return (
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Incident Date' errors={errors.incident_date}>
          {incidentDate}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-4' label='Address'>
          {screening.getIn(['address', 'street_address'])}
        </ShowField>
        <ShowField gridClassName='col-md-4' label='City'>
          {screening.getIn(['address', 'city'])}
        </ShowField>
        <ShowField gridClassName='col-md-4' label='Incident County'>
          {COUNTIES[screening.get('incident_county')]}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-4' label='State'>
          {state ? state.name : ''}
        </ShowField>
        <ShowField gridClassName='col-md-4' label='Zip'>
          {screening.getIn(['address', 'zip'])}
        </ShowField>
        <ShowField gridClassName='col-md-4' label='Location Type'>
          {screening.get('location_type')}
        </ShowField>
      </div>
    </div>
  )
}

IncidentInformationShowView.propTypes = {
  errors: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}
export default IncidentInformationShowView
