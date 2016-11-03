import React from 'react'

const NarrativeShowView = ({screening}) => (
  <div className='card double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label className='no-gap'>Report Narrative</label>
          <div className='c-gray'>{screening.get('report_narrative')}</div>
        </div>
      </div>
    </div>
  </div>
)

NarrativeShowView.propTypes = {
  screening: React.PropTypes.object.isRequired,
}
export default NarrativeShowView
