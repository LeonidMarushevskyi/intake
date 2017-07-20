import React from 'react'
import PropTypes from 'prop-types'

const HelpMessage = ({message}) => (
  <div>
    <p>{message}</p>
  </div>
)

HelpMessage.propTypes = {
  message: PropTypes.string,
}

export default HelpMessage
