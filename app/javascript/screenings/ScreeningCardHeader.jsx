import React from 'react'
import PropTypes from 'prop-types'
import EditLink from 'common/EditLink'

const ScreeningCardHeader = ({onEdit, showEdit, title}) => (
  <div className='card-header'>
    <span>{title}</span>
    {showEdit &&
      <EditLink
        ariaLabel={`Edit ${title.toLowerCase()}`}
        onClick={(event) => {
          event.preventDefault()
          onEdit()
        }}
      />
    }
  </div>
)

ScreeningCardHeader.propTypes = {
  onEdit: PropTypes.func.isRequired,
  showEdit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default ScreeningCardHeader

