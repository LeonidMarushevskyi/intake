import COUNTIES from 'Counties'
import DateField from 'components/common/DateField'
import InputField from 'components/common/InputField'
import LOCATION_TYPE from 'LocationType'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'components/common/SelectField'
import US_STATE from 'USState'

const IncidentInformationEditView = ({screening, onCancel, onSave, onChange}) => (
  <div className='card edit double-gap-top' id='incident-information-card'>
    <div className='card-header'>
      <span>Incident Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <DateField
          gridClassName='col-md-6'
          id='incident_date'
          label='Incident Date'
          value={screening.get('incident_date')}
          onChange={(value) => onChange(['incident_date'], value)}
          hasTime={false}
        />
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-6'
          id='incident_county'
          label='Incident County'
          value={screening.get('incident_county')}
          onChange={(event) => onChange(['incident_county'], event.target.value || null)}
        >
          <option key='' />
          {Object.keys(COUNTIES).map((item) => <option key={item} value={item}>{COUNTIES[item]}</option>)}
        </SelectField>
      </div>

      <fieldset className='double-gap-top'>
        <legend>Incident Address</legend>
        <div className='row'>
          <InputField
            gridClassName='col-md-6'
            id='street_address'
            label='Address'
            value={screening.getIn(['address', 'street_address']) || ''}
            onChange={(event) => onChange(['address', 'street_address'], event.target.value)}
          />
          <InputField
            gridClassName='col-md-6'
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
            value={screening.getIn(['address', 'state'])}
            onChange={(event) => onChange(['address', 'state'], event.target.value || null)}
          >
            <option key='' />
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
          value={screening.get('location_type')}
          onChange={(event) => onChange(['location_type'], event.target.value || null)}
        >
          <option key='' />
          {Object.keys(LOCATION_TYPE).map((group) => (
            <optgroup key={group} label={group}>
              {LOCATION_TYPE[group].map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup>
            )
          )}
        </SelectField>
      </div>
      <div className='row'>
        <div className='centered'>
          <button className='btn btn-primary' onClick={onSave}>Save</button>
          <button className='btn btn-default' onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)

IncidentInformationEditView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default IncidentInformationEditView
