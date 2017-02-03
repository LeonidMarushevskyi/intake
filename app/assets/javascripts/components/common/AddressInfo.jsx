import React from 'react'

const AddressInfo = (address) => {
  const {type, streetAddress, city, state, zip} = address
  const stateZip = [state, zip].filter(Boolean).join(' ')
  return (
    <div>
      <i className='fa fa-map-marker c-gray half-pad-right' />
      {type && <strong className='c-gray half-pad-right'>{type}</strong>}
      <span>{[streetAddress, city, stateZip].filter(Boolean).join(', ')}</span>
    </div>
  )
}

AddressInfo.propTypes = {
  city: React.PropTypes.string,
  state: React.PropTypes.string,
  streetAddress: React.PropTypes.string,
  type: React.PropTypes.string,
  zip: React.PropTypes.string,
}
export default AddressInfo
