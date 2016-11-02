import Gender from 'Gender'
import React from 'react'
import {Link} from 'react-router'

const ParticipantEditView = ({participant}) => (
  <div className='card edit double-gap-top' id={`participants-card-${participant.get('id')}`}>
    <div className='card-header'>
      <span>{`${participant.get('first_name')} ${participant.get('last_name')}`}</span>
      <Link aria-label='Delete participant' className='pull-right' href='#'>
        <i className='fa fa-times'></i>
      </Link>
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <label className='no-gap' htmlFor='first_name'>First Name</label>
          <input
            type='text'
            id='first_name'
            value={participant.get('first_name') || ''}
            onChange={() => null}
          />
        </div>
        <div className='col-md-6'>
          <label className='no-gap-top-desktop' htmlFor='last_name'>Last Name</label>
          <input
            type='text'
            id='last_name'
            value={participant.get('last_name') || ''}
            onChange={() => null}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='date_of_birth'>Date of birth</label>
          <input
            type='date'
            className='input-type-date'
            id='date_of_birth'
            value={participant.get('date_of_birth') || ''}
            onChange={() => null}
          />
        </div>
        <div className='col-md-6'>
          <label htmlFor='gender'>Gender</label>
          <select
            id='gender'
            value={participant.get('gender') || ''}
            onChange={() => null}
          >
            <option key='' value=''></option>
            {Object.keys(Gender).map((item) => <option key={item} value={item}>{Gender[item]}</option>)}
          </select>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='ssn'>Social security number</label>
          <input
            type='text'
            id='ssn'
            value={participant.get('ssn') || ''}
            onChange={() => null}
          />
        </div>
      </div>
      <div className='row'>
        <div className='centered'>
          <button className='btn btn-primary'>Save</button>
          <button className='btn btn-default'>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)

ParticipantEditView.propTypes = {
  participant: React.PropTypes.object.isRequired,
}
export default ParticipantEditView
