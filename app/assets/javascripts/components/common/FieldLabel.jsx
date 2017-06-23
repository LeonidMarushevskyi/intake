import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const FieldLabel = ({classes, hasError, id, label, required}) => (
  <label htmlFor={id}
    className={ClassNames(classes, {'input-error-label': hasError}, {required: required})}
  >
    {label}
  </label>
)

FieldLabel.propTypes = {
  classes: PropTypes.array,
  hasError: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
}
export default FieldLabel
