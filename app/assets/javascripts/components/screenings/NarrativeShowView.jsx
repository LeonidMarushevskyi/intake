import EditLink from 'components/common/EditLink'
import React from 'react'

const NarrativeShowView = ({narrative, onEdit}) => (
  <div className='card show double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
      <EditLink ariaLabel='Edit narrative' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label className='no-gap'>Report Narrative</label>
          <div className='c-gray'>{narrative}</div>
        </div>
      </div>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  narrative: React.PropTypes.string.isRequired,
}
export default NarrativeShowView
