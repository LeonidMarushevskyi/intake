import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import EditLink from 'common/EditLink'

const CardView = ({edit, id, mode, onEdit, show, title}) => (
  <div>
    <a className='anchor' id={`${id}-anchor`}/>
    <div className={ClassNames('card', mode, 'double-gap-bottom')} id={id}>
      <div className='card-header'>
        <span>{title}</span>
        {onEdit &&
          <EditLink
            ariaLabel={`Edit ${title && title.toLowerCase()}`}
            onClick={(event) => {
              event.preventDefault()
              onEdit()
            }}
          />
        }
      </div>
      {mode === 'edit' && edit}
      {mode === 'show' && show}
    </div>
  </div>
)

CardView.propTypes = {
  edit: PropTypes.object,
  id: PropTypes.string,
  mode: PropTypes.string,
  onEdit: PropTypes.func,
  show: PropTypes.object,
  title: PropTypes.string,
}

export default CardView
