import COUNTIES from 'enums/Counties'
import DateField from 'common/DateField'
import InputField from 'common/InputField'
import LOCATION_TYPE from 'enums/LocationType'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'
import US_STATE from 'enums/USState'

const IncidentInformationEditView = ({screening, onBlur, onCancel, onSave, onChange, errors}) => (
  <div className='card-body'>
    <div className='row'>
      <DateField
        gridClassName='col-md-4'
        id='incident_date'
        label='Incident Date'
        value={screening.get('incident_date')}
        errors={errors.incident_date}
        onChange={(value) => onChange(['incident_date'], value)}
        onBlur={() => onBlur('incident_date')}
        hasTime={false}
      />
    </div>
    <fieldset className='double-gap-top'>
      <div className='row'>
        <div className='col-md-12'>
          <legend>Incident Address</legend>
        </div>
      </div>
      <div className='row'>
        <InputField
          gridClassName='col-md-4'
          id='street_address'
          label='Address'
          maxLength='128'
          onChange={(event) => onChange(['address', 'street_address'], event.target.value)}
          value={screening.getIn(['address', 'street_address']) || ''}
        />
        <InputField
          gridClassName='col-md-4'
          id='city'
          label= 'City'
          maxLength='64'
          onChange={(event) => onChange(['address', 'city'], event.target.value)}
          value={screening.getIn(['address', 'city']) || ''}
        />
        <SelectField
          gridClassName='col-md-4'
          id='incident_county'
          label='Incident County'
          value={screening.get('incident_county')}
          onChange={(event) => onChange(['incident_county'], event.target.value || null)}
        >
          <option key='' />
          {Object.keys(COUNTIES).map((item) => <option key={item} value={item}>{COUNTIES[item]}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-4'
          id='state'
          label='State'
          value={screening.getIn(['address', 'state'])}
          onChange={(event) => onChange(['address', 'state'], event.target.value || null)}
        >
          <option key='' />
          {US_STATE.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
        </SelectField>
        <InputField
          allowCharacters={/[0-9-]/}
          gridClassName='col-md-4'
          id='zip'
          label='Zip'
          maxLength='10'
          onChange={(event) => onChange(['address', 'zip'], event.target.value)}
          value={screening.getIn(['address', 'zip']) || ''}
        />
        <SelectField
          gridClassName='col-md-4'
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
    </fieldset>
    <div className='row'>
      <div className='centered'>
        <button className='btn btn-primary' onClick={onSave}>Save</button>
        <button className='btn btn-default' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
)

IncidentInformationEditView.propTypes = {
  errors: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default IncidentInformationEditView
