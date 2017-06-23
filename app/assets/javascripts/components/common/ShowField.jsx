import ErrorMessages from 'components/common/ErrorMessages'
import FieldLabel from 'components/common/FieldLabel'
import PropTypes from 'prop-types'
import React from 'react'

const ShowField = ({gridClassName, labelClassName, label, children, required, errors}) => (
  <div className={gridClassName}>
    <FieldLabel label={label} classes={[labelClassName]}
      hasError={errors && !errors.isEmpty()} required={required}
    />
    <div className='c-gray'>{children}</div>
    <ErrorMessages errors={errors}/>
  </div>
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
