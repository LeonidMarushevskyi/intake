import React from 'react'
import PropTypes from 'prop-types'

const AlertErrorMessage = ({message}) => (
  <div className='row'>
    <div className='col-md-12'>
      <div className='alert-message error-message' role='alert'>
        <div className='alert-icon'>
          <i className='fa fa-warning' />
        </div>
        <div className='alert-text'>
          {message}
        </div>
      </div>
    </div>
  </div>
)

AlertErrorMessage.propTypes = {
  message: PropTypes.string,
}

export default AlertErrorMessage
