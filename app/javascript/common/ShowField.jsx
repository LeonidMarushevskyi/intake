import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const ShowField = ({gridClassName, labelClassName, label, children, required, errors}) => (
  <FormField label={label} labelClassName={labelClassName} gridClassName={gridClassName}
    errors={errors} required={required}
  >
    <span>{children}</span>
  </FormField>
)

ShowField.propTypes = {
  children: PropTypes.any,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  required: PropTypes.bool,
}
export default ShowField
