import React from 'react'

const NarrativeEditView = ({narrative, onCancel, onSave, onChange}) => (
  <div className='card edit double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-12'>
          <label className='no-gap' htmlFor='report_narrative'>Report Narrative</label>
          <textarea
            id='report_narrative'
            onChange={(event) => onChange(['report_narrative'], event.target.value || null)}
            value={narrative || ''}
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
  narrative: React.PropTypes.string,
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
}
export default NarrativeEditView
