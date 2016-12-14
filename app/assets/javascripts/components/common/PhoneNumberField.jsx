import React from 'react'
import PHONE_NUMBER_TYPE from 'PhoneNumberType'
import InputField from 'components/common/InputField'
import SelectField from 'components/common/SelectField'

const PhoneNumberField = ({Number, Type, onChange}) => (
  <div>
    <InputField
      gridClassName='col-md-6'
      labelClassName='no-gap'
      id='number'
      type='tel'
      placeholder='Ex: 910-435-3223'
      label='Phone Number'
      value={Number}
      onChange={(event) => onChange('number', event.target.value)}
    />
    <SelectField
      gridClassName='col-md-6'
      labelClassName='no-gap-top-desktop'
      label='Phone Number Type'
      id='type'
      value={Type}
      onChange={(event) => onChange('type', event.target.value)}
    >
      <option key='' value='' />
      {
        PHONE_NUMBER_TYPE.map((item) => <option key={item} value={item}>{item}</option>)
      }
    </SelectField>
  </div>
)
PhoneNumberField.propTypes = {
  Number: React.PropTypes.string,
  Type: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
}
export default PhoneNumberField

