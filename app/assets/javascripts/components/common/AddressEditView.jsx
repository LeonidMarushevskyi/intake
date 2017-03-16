import ADDRESS_TYPE from 'AddressType'
import InputField from 'components/common/InputField'
import React from 'react'
import SelectField from 'components/common/SelectField'
import US_STATE from 'USState'

const AddressEditView = ({id, streetAddress, city, state, zip, type, onChange}) => (
    <div className='item' id={`address-${id}`}>
      <InputField
        gridClassName='col-md-6'
        id='street_address'
        label='Address'
        labelClassName='no-gap'
        onChange={(event) => onChange('street_address', event.target.value)}
        value={streetAddress}
      />
      <InputField
        gridClassName='col-md-6'
        id='city'
        label='City'
        labelClassName='no-gap-top-desktop'
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
        {Object.keys(US_STATE).map((item) => <option key={item} value={item}>{US_STATE[item]}</option>)}
      </SelectField>
      <InputField
        gridClassName='col-md-2'
        id='zip'
        label='Zip'
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
  city: React.PropTypes.string,
  id: React.PropTypes.string,
  onChange: React.PropTypes.func,
  state: React.PropTypes.string,
  streetAddress: React.PropTypes.string,
  type: React.PropTypes.string,
  zip: React.PropTypes.string,
}
export default AddressEditView
