import EditLink from 'common/EditLink'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'

const NarrativeShowView = ({errors, screening, onEdit}) => (
  <div className='card show double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
      <EditLink ariaLabel='Edit narrative' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-12' label='Report Narrative' errors={errors.get('report_narrative')} required>
          {screening.get('report_narrative')}
        </ShowField>
      </div>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  errors: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default NarrativeShowView
