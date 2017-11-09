import * as IntakeConfig from 'common/config'
import PersonCardHeader from 'views/people/PersonCardHeader'
import PropTypes from 'prop-types'
import React from 'react'

const PersonCard = ({
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
  <div className={`card ${mode} double-gap-top`} id={`participants-card-${personId}`}>
    <PersonCardHeader
      informationFlag={informationFlag}
      onDelete={onDelete}
      showDelete={editable}
      onEdit={onEdit}
      showEdit={editable && IntakeConfig.isFeatureInactive('release_two') && mode === 'show'}
      title={personName}
    />
    <div className='card-body'>
      {mode === 'show' && show}
      {mode === 'edit' && edit}
      {mode === 'edit' &&
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={onSave}>Save</button>
            <button className='btn btn-default' onClick={onCancel}>Cancel</button>
          </div>
        </div>
      }
    </div>
  </div>
)

PersonCard.propTypes = {
  edit: PropTypes.object,
  editable: PropTypes.bool.isRequired,
  informationFlag: PropTypes.string,
  mode: PropTypes.oneOf(['edit', 'show']).isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  personId: PropTypes.string.isRequired,
  personName: PropTypes.string.isRequired,
  show: PropTypes.object,
}

export default PersonCard
