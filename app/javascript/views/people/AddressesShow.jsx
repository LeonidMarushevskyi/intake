import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'

const AddressesShow = ({addresses}) => (
  <div>
    {addresses.map(({city, state, street, type, zip}, index) => (
      <div key={index}>
        <div className='row gap-top'>
          <ShowField gridClassName='col-md-6' label='Address'>{street}</ShowField>
          <ShowField gridClassName='col-md-6' label='City'>{city}</ShowField>
        </div>
        <div className='row gap-top'>
          <ShowField gridClassName='col-md-4' label='State'>{state}</ShowField>
          <ShowField gridClassName='col-md-2' label='Zip'>{zip}</ShowField>
          <ShowField gridClassName='col-md-6' label='Address Type'>{type}</ShowField>
        </div>
      </div>
    ))}
  </div>
)

AddressesShow.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    type: PropTypes.string,
    zip: PropTypes.string,
  })),
}

export default AddressesShow
