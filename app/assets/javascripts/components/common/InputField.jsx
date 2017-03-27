import React from 'react'

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
  gridClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  labelClassName: React.PropTypes.string,
  maxLength: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  type: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
}
export default InputField
