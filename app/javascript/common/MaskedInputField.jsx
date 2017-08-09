import FormField from 'common/FormField'
import MaskedInput from 'react-maskedinput'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const MaskedInputField = ({
  blurPlaceholder,
  errors,
  focusPlaceholder,
  gridClassName,
  id,
  label,
  labelClassName,
  mask,
  onBlur,
  onChange,
  placeholder,
  required,
  type,
  value,
}) => {
  const formFieldProps = {
    errors: errors,
    gridClassName: gridClassName,
    id: id,
    label: label,
    labelClassName: labelClassName,
    required: required,
  }

  return (
    <FormField {...formFieldProps}>
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
    </FormField>
  )
}

MaskedInputField.defaultProps = {
  type: 'text',
  mask: '',
}

MaskedInputField.propTypes = {
  blurPlaceholder: PropTypes.string,
  errors: PropTypes.object,
  focusPlaceholder: PropTypes.string,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  mask: PropTypes.string,
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
export default MaskedInputField

