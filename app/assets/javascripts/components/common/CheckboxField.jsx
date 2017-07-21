import ErrorMessages from 'components/common/ErrorMessages'
import React from 'react'
import PropTypes from 'prop-types'

const CheckboxField = ({
  errors,
  id,
  value,
  checked,
  disabled,
  onChange,
  onBlur,
  required
}) => (
  <div>
    <input type='checkbox'
      id={id}
      value={value}
      checked={checked}
      disabled={disabled}
      required={required}
      aria-required={required}
      onChange={onChange}
      onBlur={onBlur}
    />
    <label className={required && 'required'} htmlFor={id}>{value}</label>
    <ErrorMessages id={id} errors={errors}/>
  </div>
)

CheckboxField.propTypes = {
  errors: PropTypes.object,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
}

export default CheckboxField
