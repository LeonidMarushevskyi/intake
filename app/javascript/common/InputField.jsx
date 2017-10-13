import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const InputField = ({
  errors,
  gridClassName,
  id,
  label,
  labelClassName,
  maxLength,
  onBlur,
  onChange,
  allowCharacters,
  placeholder,
  required,
  type,
  value,
  disabled,
}) => {
  const formFieldProps = {
    disabled,
    errors,
    gridClassName,
    htmlFor: id,
    label,
    labelClassName,
    required,
  }

  const sanitizeValue = (string, allowRegex) => {
    const characterArray = string.split('')
    return characterArray.filter((character) => character.match(allowRegex)).join('')
  }

  const onChangeWrapper = (event) => {
    if (event.target.value && allowCharacters) {
      event.target.value = sanitizeValue(event.target.value, allowCharacters)
    }
    onChange(event)
  }

  return (
    <FormField {...formFieldProps}>
      <input id={id} type={type} placeholder={placeholder}
        value={value} onChange={onChangeWrapper} maxLength={maxLength} onBlur={onBlur}
        aria-required={required} required={required} disabled={disabled}
      />
    </FormField>
  )
}

InputField.defaultProps = {
  type: 'text',
  mask: '',
}

InputField.propTypes = {
  allowCharacters: PropTypes.instanceOf(RegExp),
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
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
