import COUNTY from 'County'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import US_STATE from 'USState'
import ShowField from 'components/common/ShowField'
import EditLink from 'components/common/EditLink'

const IncidentInformationShowView = ({screening, onEdit}) => {
  const incidentDate = screening.get('incident_date') === null ?
    '' : moment(screening.get('incident_date')).format('MM/DD/YYYY')
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
            {COUNTY[screening.get('incident_county')]}
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
            {US_STATE[screening.getIn(['address', 'state'])]}
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
  onEdit: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default IncidentInformationShowView
