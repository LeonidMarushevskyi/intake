import React from 'react'

const DateField = ({gridClassName, labelClassName, id, label, onChange, value}) => (
  <div className={gridClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <input id={id} type='date' className='input-type-date' value={value} onChange={onChange}/>
  </div>
)

DateField.propTypes = {
  gridClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  labelClassName: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
}
export default DateField
