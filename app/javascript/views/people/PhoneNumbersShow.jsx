import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'

const PhoneNumbersShow = ({phoneNumbers}) => (
  <div>
    { phoneNumbers.map(({number, type}, index) => (
      <div key={index}>
        <div className='row gap-top'>
          <ShowField gridClassName='col-md-6' label='Phone Number'>{number}</ShowField>
          <ShowField gridClassName='col-md-6' label='Phone Number Type'>{type}</ShowField>
        </div>
      </div>
    ))}
  </div>
)

PhoneNumbersShow.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.string,
    type: PropTypes.string,
  })),
}

export default PhoneNumbersShow
