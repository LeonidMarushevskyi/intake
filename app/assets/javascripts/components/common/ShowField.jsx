import React from 'react'

const ShowField = ({gridClassName, labelClassName, label, children}) => (
  <div className={gridClassName}>
    <label className={labelClassName}>{label}</label>
    <div className='c-gray'>{children}</div>
  </div>
)

ShowField.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.element,
  ]),
  gridClassName: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  labelClassName: React.PropTypes.string,
}
export default ShowField
