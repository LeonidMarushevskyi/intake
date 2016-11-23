import React from 'react'

const ShowField = ({wrapperClassName, labelClassName, label, children}) => (
  <div className={wrapperClassName}>
    <label className={labelClassName}>{label}</label>
    <div className='c-gray'>{children}</div>
  </div>
)

ShowField.propTypes = {
  wrapperClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
}
export default ShowField


