import ClassNames from 'classnames'
import MaskedInput from 'react-maskedinput'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const InputField = ({
  blurPlaceholder,
  errors,
  focusPlaceholder,
  gridClassName,
  id,
  label,
  labelClassName,
  maxLength,
  mask,
  onBlur,
  onChange,
  placeholder,
  required,
  type,
  value,
}) => {
  let input =
    <input id={id} type={type} placeholder={placeholder}
      value={value} onChange={onChange} maxLength={maxLength} onBlur={onBlur}
      aria-required={required} required={required}
    />

  if (!_.isEmpty(mask)) {
    input =
      <MaskedInput id={id} type={type} value={value} mask={mask}
        placeholder={placeholder} required={required} aria-required={required}
        onBlur={(event) => {
          event.target.placeholder = blurPlaceholder
          if (!_.isEmpty(onBlur)) onBlur(id, event.target.value)
        }}
        onFocus={(event) => {
          event.target.placeholder = focusPlaceholder
        }}
        onChange={onChange}
      />
  }

  return (
    <div className={ClassNames(gridClassName, {'input-error': !_.isEmpty(errors)})}>
      <label className={
        ClassNames(labelClassName,
          {required: required},
          {'input-error-label': !_.isEmpty(errors)}
        )
      } htmlFor={id}
      >{label}</label>
      {input}
      <div>
      {!_.isEmpty(errors) &&
        errors.map((error, index) =>
          <span key={index} className='input-error-message' role='alert' aria-describedby={id}>{error}</span>
        )
      }
      </div>
    </div>
  )
}

InputField.defaultProps = {
  type: 'text',
  mask: '',
}

InputField.propTypes = {
  blurPlaceholder: PropTypes.string,
  errors: PropTypes.object,
  focusPlaceholder: PropTypes.string,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  mask: PropTypes.string,
  maxLength: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
export default InputField
