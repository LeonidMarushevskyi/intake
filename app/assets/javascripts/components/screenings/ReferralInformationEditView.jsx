import COUNTY from 'County'
import DateField from 'components/common/DateField'
import InputField from 'components/common/InputField'
import LOCATION_TYPE from 'LocationType'
import RESPONSE_TIME from 'ResponseTime'
import React from 'react'
import SCREENING_DECISION from 'ScreeningDecision'
import SelectField from 'components/common/SelectField'
import US_STATE from 'USState'

const ReferralInformationEditView = ({screening, onChange}) => (
  <div className='card edit double-gap-top' id='referral-information-card'>
    <div className='card-header'>
      <span>Referral Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <DateField
          gridClassName='col-md-6'
          labelClassName='no-gap'
          id='incident_date'
          label='Incident Date'
          value={screening.get('incident_date') || ''}
          onChange={(event) => onChange(['incident_date'], event.target.value)}
        />
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-6'
          id='incident_county'
          label='Incident County'
          value={screening.get('incident_county') || ''}
          onChange={(event) => onChange(['incident_county'], event.target.value)}
        >
          <option key='' value='' />
          {Object.keys(COUNTY).map((item) => <option key={item} value={item}>{COUNTY[item]}</option>)}
        </SelectField>
      </div>

      <fieldset className='double-gap-top'>
        <legend>Incident Address</legend>
        <div className='row'>
          <InputField
            gridClassName='col-md-6'
            labelClassName='no-gap'
            id='street_address'
            label='Address'
            value={screening.getIn(['address', 'street_address']) || ''}
            onChange={(event) => onChange(['address', 'street_address'], event.target.value)}
          />
          <InputField
            gridClassName='col-md-6'
            labelClassName='no-gap'
            id='city'
            label= 'City'
            value={screening.getIn(['address', 'city']) || ''}
            onChange={(event) => onChange(['address', 'city'], event.target.value)}
          />
        </div>
        <div className='row'>
          <SelectField
            gridClassName='col-md-6'
            id='state'
            label='State'
            value={screening.getIn(['address', 'state']) || ''}
            onChange={(event) => onChange(['address', 'state'], event.target.value)}
          >
            <option key='' value='' />
            {Object.keys(US_STATE).map((item) => <option key={item} value={item}>{US_STATE[item]}</option>)}
          </SelectField>
          <InputField
            gridClassName='col-md-6'
            id='zip'
            label='Zip'
            value={screening.getIn(['address', 'zip']) || ''}
            onChange={(event) => onChange(['address', 'zip'], event.target.value)}
          />
        </div>
      </fieldset>
      <div className='row double-gap-top'>
        <SelectField
          gridClassName='col-md-6'
          id='location_type'
          label='Location Type'
          value={screening.get('location_type') || ''}
          onChange={(event) => onChange(['location_type'], event.target.value)}
        >
          <option key='' value='' />
          {Object.keys(LOCATION_TYPE).map((group) => (
            <optgroup key={group} label={group}>
              {LOCATION_TYPE[group].map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup>
            )
          )}
        </SelectField>
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-6'
          id='response_time'
          label='Response Time'
          value={screening.get('response_time') || ''}
          onChange={(event) => onChange(['response_time'], event.target.value)}
        >
          <option key='' value='' />
          {Object.keys(RESPONSE_TIME).map((item) => <option key={item} value={item}>{RESPONSE_TIME[item]}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-6'
          id='screening_decision'
          label= 'Screening Decision'
          value={screening.get('screening_decision') || ''}
          onChange={(event) => onChange(['screening_decision'], event.target.value)}
        >
          <option key='' value='' />
          {Object.keys(SCREENING_DECISION).map((item) => <option key={item} value={item}>{SCREENING_DECISION[item]}</option>)}
        </SelectField>
      </div>
    </div>
  </div>
)

ReferralInformationEditView.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}
export default ReferralInformationEditView
