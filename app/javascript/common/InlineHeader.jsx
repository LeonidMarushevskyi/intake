import PropTypes from 'prop-types'
import React from 'react'

const InlineHeader = ({
  heading,
}) => (
  <div className='col-md-12 double-gap-top'>
    <legend>{heading}</legend>
  </div>
)

InlineHeader.propTypes = {
  heading: PropTypes.string.isRequired,
}

export default InlineHeader
