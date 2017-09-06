import React from 'react'
import PropTypes from 'prop-types'
import EditLink from 'common/EditLink'

const ParticipantCardHeader = ({informationFlag, title, onDelete, onEdit, showDelete, showEdit}) => (
  <div className='card-header'>
    <span>{title}</span>
    { informationFlag && <span className='information-flag'>{informationFlag}</span>}
    { showDelete &&
      <button aria-label='Delete participant'
        className='pull-right delete-button'
        onClick={onDelete}
      >
        <i className='fa fa-times' />
      </button>
    }
    { showEdit &&
      <EditLink
        ariaLabel='Edit participant'
        onClick={(event) => {
          event.preventDefault()
          onEdit()
        }}
      />
    }
  </div>
)

ParticipantCardHeader.propTypes = {
  informationFlag: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  showDelete: PropTypes.bool.isRequired,
  showEdit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default ParticipantCardHeader
