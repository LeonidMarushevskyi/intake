import React from 'react'

const NarrativeShowView = ({screening, onEdit}) => (
  <div className='card show double-gap-top' id='narrative-card'>
    <div className='card-header'>
      <span>Narrative</span>
      <a aria-label='Edit narrative' className='gap-right pull-right' href='#' onClick={onEdit}>
        <i className='fa fa-pencil'></i>
      </a>
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
  onEdit: React.PropTypes.func.isRequired,
  screening: React.PropTypes.object.isRequired,
}
export default NarrativeShowView
