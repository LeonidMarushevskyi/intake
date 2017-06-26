import FormField from 'components/common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const ShowField = ({gridClassName, labelClassName, label, children, required, errors}) => (
    <FormField label={label} labelClassName={labelClassName} gridClassName={gridClassName}
      errors={errors} required={required}
    >
      <div className='c-gray'>{children}</div>
    </FormField>
)

ShowField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]),
  errors: PropTypes.object,
  gridClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  required: PropTypes.bool,
}
export default ShowField
