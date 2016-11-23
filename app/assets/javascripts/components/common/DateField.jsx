import React from 'react'

const DateField = ({wrapperClassName, labelClassName, id, label, onChange, value}) => (
  <div className={wrapperClassName}>
    <label className={labelClassName} htmlFor={id}>{label}</label>
    <input id={id} type='date' className='input-type-date' value={value} onChange={onChange}/>
  </div>
)

DateField.propTypes = {
  wrapperClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
}
export default DateField
