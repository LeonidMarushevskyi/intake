import EditLink from 'components/common/EditLink'
import ShowField from 'components/common/ShowField'
import PropTypes from 'prop-types'
import React from 'react'

const NarrativeShowView = ({screening, onEdit}) => (
  <div className='card show double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
      <EditLink ariaLabel='Edit narrative' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-12' label='Report Narrative' required>
          {screening.get('report_narrative')}
        </ShowField>
      </div>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  onEdit: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default NarrativeShowView
