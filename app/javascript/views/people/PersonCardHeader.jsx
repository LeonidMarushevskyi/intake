import React from 'react'
import PropTypes from 'prop-types'
import EditLink from 'common/EditLink'

const PersonCardHeader = ({informationFlag, title, onDelete, onEdit, showDelete, showEdit}) => (
  <div className='card-header'>
    <span>{title}</span>
    { informationFlag && <span className='information-flag'>{informationFlag}</span>}
    { showDelete &&
      <button aria-label='Remove person'
        className='pull-right btn btn-warning'
        onClick={onDelete}
      >
        Remove
      </button>
    }
    { showEdit &&
      <EditLink
        ariaLabel='Edit person'
        onClick={(event) => {
          event.preventDefault()
          onEdit()
        }}
      />
    }
  </div>
)

PersonCardHeader.propTypes = {
  informationFlag: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  showDelete: PropTypes.bool.isRequired,
  showEdit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default PersonCardHeader
