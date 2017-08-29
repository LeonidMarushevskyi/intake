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
        <ShowField gridClassName='col-md-6' label='Incident Date' errors={errors.get('incident_date')}>
          {incidentDate}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Incident County'>
          {COUNTIES[screening.get('incident_county')]}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Address'>
          {screening.getIn(['address', 'street_address'])}
        </ShowField>
        <ShowField gridClassName='col-md-6' label='City'>
          {screening.getIn(['address', 'city'])}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='State'>
          {state ? state.name : ''}
        </ShowField>
        <ShowField gridClassName='col-md-6' label='Zip'>
          {screening.getIn(['address', 'zip'])}
        </ShowField>
      </div>
      <div className='row'>
        <ShowField gridClassName='col-md-6' label='Location Type'>
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
