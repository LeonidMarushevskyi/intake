import COUNTY from 'County'
import LOCATION_TYPE from 'LocationType'
import moment from 'moment'
import React from 'react'
import RESPONSE_TIME from 'ResponseTime'
import SCREENING_DECISION from 'ScreeningDecision'
import US_STATE from 'USState'

const ReferralInformationEditView = ({screening, onChange}) => (
  <div className='card edit double-gap-top' id='referral-information-card'>
    <div className='card-header'>
      <span>Referral Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='incident_date' className='no-gap'>Incident Date</label>
          <input
            type='date'
            id='incident_date'
            value={screening.get('incident_date') || ''}
            onChange={(event) => onChange(['incident_date'], event.target.value)}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='incident_county'>Incident County</label>
          <select
            id='incident_county'
            value={screening.get('incident_county') || ''}
            onChange={(event) => onChange(['incident_county'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(COUNTY).map((item) => <option key={item} value={item}>{COUNTY[item]}</option>)}
          </select>
        </div>
      </div>
      <fieldset className='double-gap-top'>
        <legend>Incident Address</legend>
        <input
          type='hidden'
          id='address_id'
          value={screening.getIn(['address', 'id']) || ''}
        />
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='street_address' className='no-gap'>Address</label>
            <input
              type='text'
              id='street_address'
              value={screening.getIn(['address', 'street_address']) || ''}
              onChange={(event) => onChange(['address', 'street_address'], event.target.value)}
            />
          </div>
          <div className='col-md-6'>
            <label htmlFor='city' className='no-gap'>City</label>
            <input
              type='text'
              id='city'
              value={screening.getIn(['address', 'city']) || ''}
              onChange={(event) => onChange(['address', 'city'], event.target.value)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='state'>State</label>
            <select
              id='state'
              value={screening.getIn(['address', 'state']) || ''}
              onChange={(event) => onChange(['address', 'state'], event.target.value)}
            >
              <option key='' value=''></option>
              {Object.keys(US_STATE).map((item) => <option key={item} value={item}>{US_STATE[item]}</option>)}
            </select>
          </div>
          <div className='col-md-6'>
            <label htmlFor='zip'>Zip</label>
            <input
              type='text'
              id='zip'
              value={screening.getIn(['address', 'zip']) || ''}
              onChange={(event) => onChange(['address', 'zip'], event.target.value)}
            />
          </div>
        </div>
      </fieldset>
      <div className='row double-gap-top'>
        <div className='col-md-6'>
          <label htmlFor='location_type'>Location Type</label>
          <select
            id='location_type'
            value={screening.get('location_type')  || ''}
            onChange={(event) => onChange(['location_type'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(LOCATION_TYPE).map((group) => {
              return (
                <optgroup key={group} label={group}>
                  {LOCATION_TYPE[group].map((item) => <option key={item} value={item}>{item}</option>)}
                </optgroup>
                )
            })}
          </select>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='response_time'>Response Time</label>
          <select
            id='response_time'
            value={screening.get('response_time') || ''}
            onChange={(event) => onChange(['response_time'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(RESPONSE_TIME).map((item) => <option key={item} value={item}>{RESPONSE_TIME[item]}</option>)}
        </select>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_decision'>Screening Decision</label>
          <select
            id='screening_decision'
            value={screening.get('screening_decision') || ''}
            onChange={(event) => onChange(['screening_decision'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(SCREENING_DECISION).map((item) => <option key={item} value={item}>{SCREENING_DECISION[item]}</option>)}
          </select>
        </div>
      </div>
    </div>
  </div>
)

ReferralInformationEditView.propTypes = {
  screening: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
export default ReferralInformationEditView
