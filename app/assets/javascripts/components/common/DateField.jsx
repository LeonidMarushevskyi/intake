import React from 'react'
import PropTypes from 'prop-types'

const DateField = ({gridClassName, labelClassName, id, label, onChange, value}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <input id={id} type='date' className='input-type-date' value={value || ''} onChange={onChange}/>
  </div>
)

DateField.propTypes = {
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}
export default DateField
