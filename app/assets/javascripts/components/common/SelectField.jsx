import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const SelectField = ({gridClassName, labelClassName, id, label, value, onChange, children, required, errors}) => (
    <div className={ClassNames(gridClassName, {'input-error': (errors && !errors.isEmpty())})}>
      <label className={
        ClassNames(labelClassName, {required: required}, {'input-error-label': (errors && !errors.isEmpty())})
      } htmlFor={id}
      >{label}</label>
    <select id={id} value={value || ''} onChange={onChange}
      aria-required={required} required={required}
    >{children}</select>
    <div>
      {errors && !errors.isEmpty() &&
        errors.map((error, index) =>
          <span key={index} className='input-error-message' role='alert' aria-describedby={id}>{error}</span>
        )
      }
    </div>
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
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default SelectField
