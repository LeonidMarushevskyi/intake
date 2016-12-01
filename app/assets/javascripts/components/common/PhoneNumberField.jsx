import React from 'react'
import PHONE_NUMBER_TYPE from 'PhoneNumberType'
import InputField from 'components/common/InputField'
import SelectField from 'components/common/SelectField'

const PhoneNumberField = ({phoneNumber, phoneNumberType, onChange}) => (
  <div>
    <InputField
      gridClassName='col-md-6'
      labelClassName='no-gap'
      id='phone_number'
      type='tel'
      placeholder='Ex: 910-435-3223'
      label='Phone Number'
      value={phoneNumber}
      onChange={(event) => onChange('phone_number', event.target.value)}
    />
    <SelectField
      gridClassName='col-md-6'
      labelClassName='no-gap-top-desktop'
      label='Phone Number Type'
      id='phone_number_type'
      value={phoneNumberType}
      onChange={(event) => onChange('phone_number_type', event.target.value)}
    >
      <option key='' value=''></option>
      {
        Object.keys(PHONE_NUMBER_TYPE).map((item) =>
          <option key={item} value={item}>{PHONE_NUMBER_TYPE[item]}</option>
          )
      }
    </SelectField>
  </div>
)
export default PhoneNumberField

