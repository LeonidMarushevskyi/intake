import React from 'react'
import PropTypes from 'prop-types'

const InfoMessage = ({message}) => (
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

InfoMessage.propTypes = {
  message: PropTypes.string,
}

export default InfoMessage
