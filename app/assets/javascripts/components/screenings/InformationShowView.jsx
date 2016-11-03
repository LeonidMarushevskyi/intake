import React from 'react'
import COMMUNICATION_METHOD from 'CommunicationMethod'
import moment from 'moment'

function parseDateTime(dateTime) {
  return (dateTime === null ? '' : moment.utc(dateTime).format('MM/DD/YYYY hh:mm A'))
}

const InformationShowView = ({screening}) => (
  <div className='card double-gap-top' id='screening-information-card'>
    <div className='card-header'>
      <span>Screening Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label className='no-gap'>Title/Name of Screening</label>
          <div className='c-gray'>{screening.get('name')}</div>
        </div>
      </div>
      <div className='row double-gap-top'>
        <div className='col-md-6'>
          <label className='no-gap'>Screening Start Date/Time</label>
          <div className='c-gray'>{parseDateTime(screening.get('started_at'))}</div>
        </div>
        <div className='col-md-6'>
          <label className='no-gap'>Screening End Date/Time</label>
          <div className='c-gray'>{parseDateTime(screening.get('ended_at'))}</div>
        </div>
      </div>
      <div className='row double-gap-top'>
        <div className='col-md-6'>
          <label className='no-gap'>Communication Method</label>
          <div className='c-gray'>{COMMUNICATION_METHOD[screening.get('communication_method')]}</div>
        </div>
      </div>
    </div>
  </div>
)

InformationShowView.propTypes = {
  screening: React.PropTypes.object.isRequired,
}

export default InformationShowView
