import PropTypes from 'prop-types'
import React from 'react'

const ErrorMessages = ({ariaDescribedBy, errors}) => (
  <div>
    {errors &&
      errors.map((error, index) =>
        <span key={`error-${index}`} className='input-error-message' role='alert' aria-describedby={ariaDescribedBy}>{error}</span>
      )
    }
  </div>
)

ErrorMessages.propTypes = {
  ariaDescribedBy: PropTypes.string,
  errors: PropTypes.array,
}
export default ErrorMessages
