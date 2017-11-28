import PropTypes from 'prop-types'
import React from 'react'

const ErrorDetail = ({errors}) => (
  <div className='alert-message error-message' role='alert'>
    <div className='alert-icon'>
      <i className='fa fa-warning' />
    </div>
    <div className='alert-text'>
      <ul>
        { errors.map((error, index) => (<li key={index}>{error}</li>)) }
      </ul>
    </div>
  </div>
)

ErrorDetail.propTypes = {
  errors: PropTypes.array.isRequired,
}

export default ErrorDetail
