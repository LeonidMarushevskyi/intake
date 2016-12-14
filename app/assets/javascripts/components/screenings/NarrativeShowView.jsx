import EditLink from 'components/common/EditLink'
import ShowField from 'components/common/ShowField'
import React from 'react'

const NarrativeShowView = ({narrative, onEdit}) => (
  <div className='card show double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
      <EditLink ariaLabel='Edit narrative' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-6' labelClassName='no-gap' label='Report Narrative'>
          {narrative}
        </ShowField>
      </div>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  narrative: React.PropTypes.string.isRequired,
  onEdit: React.PropTypes.func.isRequired,
}
export default NarrativeShowView
