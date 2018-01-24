import PropTypes from 'prop-types'
import React from 'react'
import DateField from 'common/DateField'
import InputField from 'common/InputField'
import SelectField from 'common/SelectField'

const IncidentInformationForm = ({incidentDate, errors, onChange, onBlur, address, usStates, selectedCounty, counties, selectedLocationType, locationTypes, onSave, onCancel}) => (
  <div className='card-body'>
    <div className='row'>
      <DateField
        gridClassName='col-md-4'
        id='incident_date'
        label='Incident Date'
        value={incidentDate}
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
          onChange={({target: {value}}) => onChange(['address', 'street_address'], value)}
          value={address.streetAddress}
        />
        <InputField
          gridClassName='col-md-4'
          id='city'
          label= 'City'
          maxLength='64'
          onChange={({target: {value}}) => onChange(['address', 'city'], value)}
          value={address.city}
        />
        <SelectField
          gridClassName='col-md-4'
          id='incident_county'
          label='Incident County'
          value={selectedCounty}
          onChange={({target: {value}}) => onChange(['incident_county'], value)}
        >
          <option key='' />
          {counties.map((county) => <option key={county.key} value={county.key}>{county.name}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-4'
          id='state'
          label='State'
          value={address.state}
          onChange={({target: {value}}) => onChange(['address', 'state'], value)}
        >
          <option key='' />
          {usStates.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
        </SelectField>
        <InputField
          allowCharacters={/[0-9-]/}
          gridClassName='col-md-4'
          id='zip'
          label='Zip'
          maxLength='10'
          onChange={({target: {value}}) => onChange(['address', 'zip'], value)}
          value={address.zip}
        />
        <SelectField
          gridClassName='col-md-4'
          id='location_type'
          label='Location Type'
          value={selectedLocationType}
          onChange={({target: {value}}) => onChange(['location_type'], value)}
        >
          <option key='' />
          {locationTypes.map((locationType) =>
            <optgroup key={locationType.name} value={locationType.name}>
              {locationType.locations.map((location) =>
                <option key={location} value={location}>{location}</option>)
              }
            </optgroup>
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

IncidentInformationForm.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    streetAddress: PropTypes.string,
    zip: PropTypes.string,
  }),
  counties: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
  })),
  errors: PropTypes.shape({
    incident_date: PropTypes.arrayOf(PropTypes.string),
  }),
  incidentDate: PropTypes.string,
  locationTypes: PropTypes.arrayOf(PropTypes.shape({
    locations: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
  })),
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  selectedCounty: PropTypes.string,
  selectedLocationType: PropTypes.string,
  usStates: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  })),
}

export default IncidentInformationForm
