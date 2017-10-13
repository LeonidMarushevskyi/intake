import FormField from 'common/FormField'
import MaskedInput from 'react-maskedinput'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const MaskedInputField = ({
  errors,
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
  const formFieldProps = {errors, gridClassName, htmlFor: id, label, labelClassName, required}

  return (
    <FormField {...formFieldProps}>
      <MaskedInput className='masked-input' id={id} type={type} value={value} mask={mask}
        placeholder={''} required={required} aria-required={required}
        onBlur={(event) => {
          event.target.placeholder = ''
          if (!_.isEmpty(onBlur)) onBlur(id, event.target.value)
        }}
        onFocus={(event) => (event.target.placeholder = placeholder)}
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
  errors: PropTypes.array,
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
