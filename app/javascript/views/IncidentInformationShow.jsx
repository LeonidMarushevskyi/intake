import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'

const IncidentInformationShow = ({incidentDate, incidentCounty, address, locationType, errors}) => (
  <div className='card-body'>
    <div className='row'>
      <ShowField gridClassName='col-md-6' label='Incident Date' errors={errors.incident_date}>
        {incidentDate}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Address'>
        {address.streetAddress}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='City'>
        {address.city}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Incident County'>
        {incidentCounty}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='State'>
        {address.state}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Zip'>
        {address.zip}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Location Type'>
        {locationType}
      </ShowField>
    </div>
  </div>
)

IncidentInformationShow.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    streetAddress: PropTypes.string,
    zip: PropTypes.string,
  }),
  errors: PropTypes.object,
  incidentCounty: PropTypes.string,
  incidentDate: PropTypes.string,
  locationType: PropTypes.string,
}

export default IncidentInformationShow
