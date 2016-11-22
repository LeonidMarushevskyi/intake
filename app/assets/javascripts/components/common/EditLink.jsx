import React from 'react'

const EditLink = ({ariaLabel, onClick}) => (
  <a aria-label={ariaLabel} className='gap-right pull-right' href='#' onClick={onClick}>
    <i className='fa fa-pencil'></i>
  </a>
)

EditLink.propTypes = {
  ariaLabel: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
}
export default EditLink
