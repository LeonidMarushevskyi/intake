import PropTypes from 'prop-types'
import React from 'react'
import PHONE_NUMBER_TYPE from 'enums/PhoneNumberType'
import MaskedInputField from 'common/MaskedInputField'
import SelectField from 'common/SelectField'

const PhoneNumberField = ({Number, Type, onChange}) => (
  <div>
    <MaskedInputField
      gridClassName='col-md-6'
      id='number'
      label='Phone Number'
      mask='(111)111-1111'
      placeholder='(___)___-____'
      maxLength='13'
      onChange={(event) => onChange('number', event.target.value)}
      type='tel'
      value={Number}
    />
    <SelectField
      gridClassName='col-md-6'
      label='Phone Number Type'
      id='type'
      value={Type}
      onChange={(event) => onChange('type', event.target.value || null)}
    >
      <option key='' />
      {
        PHONE_NUMBER_TYPE.map((item) => <option key={item} value={item}>{item}</option>)
      }
    </SelectField>
  </div>
)
PhoneNumberField.propTypes = {
  Number: PropTypes.string,
  Type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}
export default PhoneNumberField
