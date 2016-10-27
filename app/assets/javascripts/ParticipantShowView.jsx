import React from 'react'
import {Link} from 'react-router'
import Gender from 'Gender'

const ParticipantShowView = ({participant}) => (
  <div className='card show double-gap-top' id={`participants-card-${participant.get('id')}`}>
    <div className='card-header'>
      <span>{`${participant.get('first_name')} ${participant.get('last_name')}`}</span>
      <Link aria-label='Delete participant' className='pull-right' href='#'>
        <i className='fa fa-times'></i>
      </Link>
      <Link aria-label='Edit participant' className='gap-right pull-right' href='#'>
        <i className='fa fa-pencil'></i>
      </Link>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-2'>
          <img src='/assets/default-profile.svg' />
        </div>
        <div className='col-md-5'>
          <label className='no-gap'>Name</label>
          <div className='c-gray'>{`${participant.get('first_name')} ${participant.get('last_name')}`}</div>
          <label>Gender</label>
          <div className='c-gray'>{Gender[participant.get('gender')]}</div>
        </div>
        <div className='col-md-5'>
          <label className='no-gap-top-desktop'>Date of birth</label>
          <div className='c-gray'>{participant.get('date_of_birth')}</div>
          <label>Social security number</label>
          <div className='c-gray'>{participant.get('ssn')}</div>
        </div>
      </div>
    </div>
  </div>
)

ParticipantShowView.propTypes = {
  participant: React.PropTypes.object.isRequired,
}
export default ParticipantShowView
