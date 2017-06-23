import ClassNames from 'classnames'
import ErrorMessages from 'components/common/ErrorMessages'
import FieldLabel from 'components/common/FieldLabel'
import PropTypes from 'prop-types'
import React from 'react'

const SelectField = ({gridClassName, labelClassName, id, label, value, onChange, onBlur, children, required, errors}) => (
  <div className={ClassNames(gridClassName, {'input-error': (errors && !errors.isEmpty())})}>
    <FieldLabel id={id} label={label} classes={[labelClassName]}
      hasError={errors && !errors.isEmpty()} required={required}
    />
    <select id={id} value={value || ''} onChange={onChange} onBlur={onBlur}
      aria-required={required} required={required}
    >{children}</select>
    <ErrorMessages id={id} errors={errors}/>
  </div>
)

SelectField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  errors: PropTypes.object,
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
