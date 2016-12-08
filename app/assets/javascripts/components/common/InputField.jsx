import React from 'react'

const InputField = ({gridClassName, labelClassName, id, label, onChange, value, placeholder, type}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}/>
  </div>
)

InputField.defaultProps = {
  type: 'text',
}
InputField.propTypes = {
  gridClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  type: React.PropTypes.string,
}
export default InputField
