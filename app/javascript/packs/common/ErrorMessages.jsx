import PropTypes from 'prop-types'
import React from 'react'

const ErrorMessages = ({id, errors}) => (
  <div>
    {errors &&
      errors.map((error, index) =>
        <span key={`error-${index}`} className='input-error-message' role='alert' aria-describedby={id}>{error}</span>
      )
    }
  </div>
)

ErrorMessages.propTypes = {
  errors: PropTypes.object,
  id: PropTypes.string,
}
export default ErrorMessages
