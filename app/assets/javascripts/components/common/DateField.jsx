import React from 'react'
import PropTypes from 'prop-types'

const DateField = ({gridClassName, labelClassName, id, label, onChange, value, required}) => {
  let classNames = labelClassName || ''

  if (required) {
    classNames = classNames.concat(' required').trim()
  }

  return (
    <div className={gridClassName}>
      <label className={classNames} htmlFor={id}>{label}</label>
      <input id={id} type='date' className='input-type-date' value={value || ''} onChange={onChange}
        aria-required={required} required={required}
      />
    </div>
  )
}

DateField.propTypes = {
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default DateField
