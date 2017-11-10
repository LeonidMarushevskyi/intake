import React from 'react'
import PropTypes from 'prop-types'
import InputField from 'common/InputField'
import SelectField from 'common/SelectField'

const AddressesForm = ({addAddress, addresses, addressTypeOptions, deleteAddress, onChange, stateOptions}) => (
  <div>
    {addresses.map(({city, state, street, type, zip}, index) => (
      <div key={index} className='row list-item'>
        <InputField
          gridClassName='col-md-6'
          id='street_address'
          label='Address'
          maxLength='128'
          onChange={({target: {value}}) => onChange(index, 'street', value)}
          value={street}
        />
        <InputField
          gridClassName='col-md-6'
          id='city'
          label='City'
          maxLength='64'
          onChange={({target: {value}}) => onChange(index, 'city', value)}
          value={city}
        />
        <SelectField
          gridClassName='col-md-4'
          id='state'
          label='State'
          onChange={({target: {value}}) => onChange(index, 'state', value)}
          value={state}
        >
          <option key='' value='' />
          {stateOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        <InputField
          allowCharacters={/[0-9-]/}
          gridClassName='col-md-2'
          id='zip'
          label='Zip'
          maxLength='10'
          onChange={({target: {value}}) => onChange(index, 'zip', value)}
          value={zip}
        />
        <SelectField
          gridClassName='col-md-6'
          id='address_type'
          label='Address Type'
          onChange={({target: {value}}) => onChange(index, 'type', value)}
          value={type}
        >
          <option key='' value='' />
          {addressTypeOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
        </SelectField>

        <a
          className='list-item__a'
          aria-label='Delete address'
          href='#'
          onClick={(event) => {
            event.preventDefault()
            deleteAddress(index)
          }}
        >
          <i className='fa fa-times' />
        </a>
      </div>
    ))}
    <div className='row'>
      <div className='col-md-12'>
        <button
          className='btn btn-default btn-block'
          aria-label='Add address'
          onClick={addAddress}
        >
          <i className='fa fa-plus' />
          <span> Add new address</span>
        </button>
      </div>
    </div>
  </div>
)

AddressesForm.propTypes = {
  addAddress: PropTypes.func,
  addressTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  addresses: PropTypes.arrayOf(PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    type: PropTypes.string,
    zip: PropTypes.string,
  })),
  deleteAddress: PropTypes.func,
  onChange: PropTypes.func,
  stateOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
}

export default AddressesForm
