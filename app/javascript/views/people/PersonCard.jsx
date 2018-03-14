import PersonCardHeader from 'views/people/PersonCardHeader'
import PropTypes from 'prop-types'
import React from 'react'

const PersonCard = ({
  deletable,
  edit,
  editable,
  informationFlag,
  mode,
  onCancel,
  onDelete,
  onEdit,
  onSave,
  personId,
  personName,
  show,
}) => (
  <div className={`card ${mode} double-gap-bottom`} id={`participants-card-${personId}`}>
    <PersonCardHeader
      informationFlag={informationFlag}
      onDelete={onDelete}
      showDelete={deletable}
      onEdit={onEdit}
      showEdit={editable && mode === 'show'}
      title={personName}
    />
    <div className='card-body'>
      {mode === 'show' && show}
      {mode === 'edit' && edit}
      {mode === 'edit' &&
        <div className='row'>
          <div className='col-md-12'>
            <div className='pull-right'>
              <button className='btn btn-default' onClick={onCancel}>Cancel</button>
              <button className='btn btn-primary' onClick={onSave}>Save</button>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
)

PersonCard.propTypes = {
  deletable: PropTypes.bool,
  edit: PropTypes.object,
  editable: PropTypes.bool.isRequired,
  informationFlag: PropTypes.string,
  mode: PropTypes.oneOf(['edit', 'show']).isRequired,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  personId: PropTypes.string.isRequired,
  personName: PropTypes.string.isRequired,
  show: PropTypes.object,
}

export default PersonCard
