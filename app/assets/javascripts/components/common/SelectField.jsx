import React from 'react'

const SelectField = ({gridClassName, labelClassName, id, label, value, onChange, children}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={onChange}>{children}</select>
  </div>
)

SelectField.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]).isRequired,
  gridClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  labelClassName: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
}
export default SelectField
