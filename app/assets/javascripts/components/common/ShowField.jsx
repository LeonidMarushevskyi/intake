import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const ShowField = ({gridClassName, labelClassName, label, children, required}) => (
  <div className={gridClassName}>
    <label className={ClassNames(labelClassName, {required: required})}>{label}</label>
    <div className='c-gray'>{children}</div>
  </div>
)

ShowField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]),
  gridClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  required: PropTypes.bool,
}
export default ShowField
