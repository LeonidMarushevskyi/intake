import PropTypes from 'prop-types'
import React from 'react'

const NarrativeEditView = ({screening, onCancel, onSave, onChange}) => (
  <div className='card edit double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-12'>
          <label htmlFor='report_narrative' className='required'>Report Narrative</label>
          <textarea
            id='report_narrative'
            onChange={(event) => onChange(['report_narrative'], event.target.value || null)}
            required value={screening.get('report_narrative') || ''}
          />
        </div>
      </div>
      <div className='row'>
        <div className='centered'>
          <button className='btn btn-primary' onClick={onSave}>Save</button>
          <button className='btn btn-default' onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)

NarrativeEditView.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default NarrativeEditView
