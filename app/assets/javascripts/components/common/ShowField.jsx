import React from 'react'

const ShowField = ({gridClassName, labelClassName, label, children}) => (
  <div className={gridClassName}>
    <label className={labelClassName}>{label}</label>
    <div className='c-gray'>{children}</div>
  </div>
)

ShowField.propTypes = {
  gridClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
}
export default ShowField
