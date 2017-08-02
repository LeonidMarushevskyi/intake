import COUNTIES from 'Counties'
import EditLink from 'components/common/EditLink'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'components/common/ShowField'
import US_STATE from 'USState'
import {dateFormatter} from 'utils/dateFormatter'

const IncidentInformationShowView = ({screening, onEdit, errors}) => {
  const incidentDate = dateFormatter(screening.get('incident_date'))
  const state = US_STATE.find((state) => state.code === screening.getIn(['address', 'state']))

  return (
    <div className='card show double-gap-top' id='incident-information-card'>
      <div className='card-header'>
        <span>Incident Information</span>
        <EditLink ariaLabel='Edit incident information' onClick={onEdit} />
      </div>
      <div className='card-body'>
        <div className='row'>
          <ShowField gridClassName='col-md-6' label='Incident Date'>
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
    </div>
  )
}

IncidentInformationShowView.propTypes = {
  errors: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default IncidentInformationShowView
