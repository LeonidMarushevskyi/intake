import PropTypes from 'prop-types'
import React from 'react'

const AlertInfoMessage = ({message}) => (
  <div className='row'>
    <div className='col-md-12'>
      <div className='alert-message info-message'>
        <div className='alert-icon'>
          <i className='fa fa-info-circle' />
        </div>
        <div className='alert-text'>
          {message}
        </div>
      </div>
    </div>
  </div>
)

AlertInfoMessage.propTypes = {
  message: PropTypes.string,
}

export default AlertInfoMessage
