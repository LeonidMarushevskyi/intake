import React from 'react'
import PropTypes from 'prop-types'

const CheckboxField = ({id, value, checked, disabled, onChange}) => (
  <div>
    <input type='checkbox'
      id={id}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    <label htmlFor={id}>{value}</label>
  </div>
)

CheckboxField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default CheckboxField
