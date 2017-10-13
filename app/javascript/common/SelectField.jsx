import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const SelectField = ({gridClassName, labelClassName, id, label, value, onChange, onBlur, children, required, errors}) => (
  <FormField htmlFor={id} label={label} labelClassName={labelClassName} gridClassName={gridClassName}
    errors={errors} required={required}
  >
    <select id={id} value={value || ''} onChange={onChange} onBlur={onBlur}
      aria-required={required} required={required}
    >
      {children}
    </select>
  </FormField>
)

SelectField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
  ]).isRequired,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default SelectField
