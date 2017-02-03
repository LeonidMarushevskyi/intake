import React from 'react'

const PhoneNumberInfo = (PhoneNumber) => {
  const {number, type} = PhoneNumber
  return (
    <div>
      <i className='fa fa-phone c-gray half-pad-right' />
      {type && <strong className='c-gray half-pad-right'>{type}</strong>}
      {number && <span>{number}</span>}
    </div>
  )
}

PhoneNumberInfo.propTypes = {
  number: React.PropTypes.string,
  type: React.PropTypes.string,
}
export default PhoneNumberInfo
