import React from 'react'

const SelectField = ({wrapperClassName, labelClassName, id, label, value, onChange, children}) => (
  <div className={wrapperClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={onChange}>{children}</select>
  </div>
)

SelectField.propTypes = {
  wrapperClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]).isRequired,
}
export default SelectField
