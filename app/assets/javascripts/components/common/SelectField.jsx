import PropTypes from 'prop-types'
import React from 'react'

const SelectField = ({gridClassName, labelClassName, id, label, value, onChange, children, required}) => {
  let classNames = labelClassName || ''

  if (required) {
    classNames = classNames.concat(' required').trim()
  }

  return (
    <div className={gridClassName}>
      <label className={classNames} htmlFor={id}>{label}</label>
      <select id={id} value={value || ''} onChange={onChange}
        aria-required={required} required={required}
      >{children}</select>
    </div>
  )
}

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
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default SelectField
