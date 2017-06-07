import PropTypes from 'prop-types'
import React from 'react'

const SelectField = ({gridClassName, labelClassName, id, label, value, onChange, children}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <select id={id} value={value || ''} onChange={onChange}>{children}</select>
  </div>
)

SelectField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}
export default SelectField
