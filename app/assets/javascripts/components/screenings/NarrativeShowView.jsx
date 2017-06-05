import EditLink from 'components/common/EditLink'
import ShowField from 'components/common/ShowField'
import PropTypes from 'prop-types'
import React from 'react'

const NarrativeShowView = ({narrative, onEdit}) => (
  <div className='card show double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
      <EditLink ariaLabel='Edit narrative' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <ShowField gridClassName='col-md-12' label='Report Narrative' labelClassName='required'>
          {narrative}
        </ShowField>
      </div>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  narrative: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
}
export default NarrativeShowView
