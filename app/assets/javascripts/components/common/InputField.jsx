import React from 'react'
import PropTypes from 'prop-types'

const InputField = ({gridClassName, labelClassName, id, label, onChange, value, placeholder, type, maxLength}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}/>
  </div>
)

InputField.defaultProps = {
  type: 'text',
}
InputField.propTypes = {
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  maxLength: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
export default InputField
