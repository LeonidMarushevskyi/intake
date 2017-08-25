import ADDRESS_TYPE from 'enums/AddressType'
import InputField from 'common/InputField'
import React from 'react'
import PropTypes from 'prop-types'
import SelectField from 'common/SelectField'
import US_STATE from 'enums/USState'

const AddressEditView = ({streetAddress, city, state, zip, type, onChange}) => (
  <div className='item' >
    <InputField
      gridClassName='col-md-6'
      id='street_address'
      label='Address'
      maxLength='128'
      onChange={(event) => onChange('street_address', event.target.value)}
      value={streetAddress}
    />
    <InputField
      gridClassName='col-md-6'
      id='city'
      label='City'
      maxLength='64'
      onChange={(event) => onChange('city', event.target.value)}
      value={city}
    />
    <SelectField
      gridClassName='col-md-4'
      id='state'
      label='State'
      onChange={(event) => onChange('state', event.target.value)}
      value={state}
    >
      <option key='' value='' />
      {US_STATE.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
    </SelectField>
    <InputField
      allowCharacters={/[0-9-]/}
      gridClassName='col-md-2'
      id='zip'
      label='Zip'
      maxLength='10'
      onChange={(event) => onChange('zip', event.target.value)}
      value={zip}
    />
    <SelectField
      gridClassName='col-md-6'
      id='address_type'
      label='Address Type'
      onChange={(event) => onChange('type', event.target.value)}
      value={type}
    >
      <option key='' value='' />
      {ADDRESS_TYPE.map((item) => <option key={item} value={item}>{item}</option>)}
    </SelectField>
  </div>
)
AddressEditView.propTypes = {
  city: PropTypes.string,
  onChange: PropTypes.func,
  state: PropTypes.string,
  streetAddress: PropTypes.string,
  type: PropTypes.string,
  zip: PropTypes.string,
}
export default AddressEditView
