import PropTypes from 'prop-types'
import React from 'react'

const EditLink = ({ariaLabel, onClick}) => (
  <a aria-label={ariaLabel} className='btn btn-primary pull-right' href='#' onClick={onClick}>
    Edit
  </a>
)

EditLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
export default EditLink
