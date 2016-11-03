import React from 'react'

const NarrativeEditView = ({screening, onChange}) => (
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
            value={screening.get('report_narrative') || ''}
            onChange={(event) => onChange(['report_narrative'], event.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
)

NarrativeEditView.propTypes = {
  screening: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
export default NarrativeEditView
