import React from 'react'
import PropTypes from 'prop-types'

const EditLink = ({ariaLabel, onClick}) => (
  <a aria-label={ariaLabel} className='gap-right pull-right' href='#' onClick={onClick}>
    <i className='fa fa-pencil' />
  </a>
)

EditLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
export default EditLink
