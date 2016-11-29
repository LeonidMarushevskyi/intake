import React from 'react'

const InputField = ({gridClassName, labelClassName, id, label, onChange, value}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <input id={id} type='text' value={value} onChange={onChange}/>
  </div>
)

InputField.propTypes = {
  gridClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
}
export default InputField
