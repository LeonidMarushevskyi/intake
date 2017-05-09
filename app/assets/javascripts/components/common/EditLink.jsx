import React from 'react'
import PropTypes from 'prop-types'

const EditLink = ({ariaLabel, onClick}) => (
  <button aria-label={ariaLabel} className='btn btn-primary pull-right' href='#' onClick={onClick}>
    Edit
  </button>
)

EditLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
export default EditLink
