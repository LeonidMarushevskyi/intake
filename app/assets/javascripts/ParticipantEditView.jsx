import React from 'react'
import {Link} from 'react-router'

const ParticipantEditView = ({participant}) => (
  <div className='card edit double-gap-top' id={`participants-card-${participant.get('id')}`}>
    <input type='hidden' name='screening[participant_ids][]' value={participant.get('id')} />
    <div className='card-header'>
      <span>{`${participant.get('first_name')} ${participant.get('last_name')}`}</span>
      <Link aria-label='Delete participant' className='pull-right' href='#'>
        <i className='fa fa-times'></i>
      </Link>
    </div>
    <div className='card-body'>
    </div>
  </div>
)

ParticipantEditView.propTypes = {
  participant: React.PropTypes.object.isRequired,
}
export default ParticipantEditView
