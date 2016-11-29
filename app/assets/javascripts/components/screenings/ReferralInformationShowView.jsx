import COUNTY from 'County'
import moment from 'moment'
import React from 'react'
import RESPONSE_TIME from 'ResponseTime'
import SCREENING_DECISION from 'ScreeningDecision'
import US_STATE from 'USState'
import ShowField from 'components/common/ShowField'

const ReferralInformationShowView = ({screening}) => {
  const incidentDate = screening.get('incident_date') === null ?
    '' : moment(screening.get('incident_date')).format('MM/DD/YYYY')
  return (
    <div className='card double-gap-top' id='referral-information-card'>
      <div className='card-header'>
        <span>Referral Information</span>
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
        <div className='row'>
          <ShowField gridClassName='col-md-6' label='Response Time'>
            {RESPONSE_TIME[screening.get('response_time')]}
          </ShowField>
        </div>
        <div className='row'>
          <ShowField gridClassName='col-md-6' label='Screening Decision'>
            {SCREENING_DECISION[screening.get('screening_decision')]}
          </ShowField>
        </div>
      </div>
    </div>
  )
}

ReferralInformationShowView.propTypes = {
  screening: React.PropTypes.object.isRequired,
}
export default ReferralInformationShowView
