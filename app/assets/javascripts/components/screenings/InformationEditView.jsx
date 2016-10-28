import React from 'react'
import CommunicationMethod from 'CommunicationMethod'

const InformationEditView = ({screening, onChange}) => (
  <div className='card edit double-gap-top' id='screening-information-card'>
    <div className='card-header'>
      <span>Screening Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label className='no-gap' htmlFor='screening_name'>Title/Name of Screening</label>
          <input
            name='screening[name]'
            id='screening_name'
            placeholder='Enter name of the screening'
            value={screening.get('name') || ''}
            onChange={(event) => onChange(['name'], event.target.value)}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_started_at'>Screening Start Date/Time</label>
          <input
            type='datetime'
            name='screening[started_at]'
            id='screening_started_at'
            value={screening.get('started_at') || ''}
            onChange={(event) => onChange(['started_at'], event.target.value)}
          />
        </div>
        <div className='col-md-6'>
          <label htmlFor='screening_ended_at'>Screening End Date/Time</label>
          <input
            type='datetime'
            name='screening[ended_at]'
            id='screening_ended_at'
            value={screening.get('ended_at') || ''}
            onChange={(event) => onChange(['ended_at'], event.target.value)}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='screening_communication_method'>Communication Method</label>
          <select
            name='screening[communication_method]'
            id='screening_communication_method'
            value={screening.get('communication_method') || ''}
            onChange={(event) => onChange(['communication_method'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(CommunicationMethod).map((item) => <option key={item} value={item}>{CommunicationMethod[item]}</option>)}
          </select>
        </div>
      </div>
    </div>
  </div>
)

InformationEditView.propTypes = {
  screening: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
export default InformationEditView
