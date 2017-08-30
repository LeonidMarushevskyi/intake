import React from 'react'
import PropTypes from 'prop-types'
import EditLink from 'common/EditLink'

const ParticipantCardHeader = ({title, onDelete, onEdit, showEdit}) => (
  <div className='card-header'>
    <span>{title}</span>
    <button aria-label='Delete participant'
      className='pull-right delete-button'
      onClick={onDelete}
    >
      <i className='fa fa-times' />
    </button>
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
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  showEdit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default ParticipantCardHeader

