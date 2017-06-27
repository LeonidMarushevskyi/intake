import React from 'react'
import PropTypes from 'prop-types'

const CheckboxField = ({id, value, checked, disabled, onChange, required}) => (
  <div>
    <input type='checkbox'
      id={id}
      value={value}
      checked={checked}
      disabled={disabled}
      required={required}
      aria-required={required}
      onChange={onChange}
    />
    <label className={required && 'required'} htmlFor={id}>{value}</label>
  </div>
)

CheckboxField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}

export default CheckboxField
