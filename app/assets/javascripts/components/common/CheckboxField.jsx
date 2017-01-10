import React from 'react'

const CheckboxField = ({id, value, checked, disabled, onChange}) => (
  <li>
    <input type='checkbox'
      id={id}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    <label htmlFor={id}>{value}</label>
  </li>
)

CheckboxField.propTypes = {
  checked: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  id: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
}

export default CheckboxField
