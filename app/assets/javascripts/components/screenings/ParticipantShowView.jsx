import EditLink from 'components/common/EditLink'
import GENDER from 'Gender'
import React from 'react'
import US_STATE from 'USState'
import ShowField from 'components/common/ShowField'
import nameFormatter from 'utils/nameFormatter'

const ParticipantShowView = ({participant, onDelete, onEdit}) => (
  <div className='card show double-gap-top' id={`participants-card-${participant.get('id')}`}>
    <div className='card-header'>
      <span>{nameFormatter(participant)}</span>
      <button aria-label='Delete participant'
        className='pull-right delete-button'
        onClick={() => onDelete(participant.get('id'))}
      >
        <i className='fa fa-times' />
      </button>

      <EditLink ariaLabel='Edit participant' onClick={onEdit} />
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-2'>
          <img src='/assets/default-profile.svg' />
        </div>
        <div className='col-md-5'>
          <ShowField labelClassName='no-gap' label='Name'>
            {nameFormatter(participant)}
          </ShowField>
          <ShowField label='Gender'>
            {GENDER[participant.get('gender')]}
          </ShowField>
        </div>
        <div className='col-md-5'>
          <ShowField labelClassName='no-gap-top-desktop' label='Date of birth'>
            {participant.get('date_of_birth')}
          </ShowField>
          <ShowField label='Social security number'>
            {participant.get('ssn')}
          </ShowField>
        </div>
      </div>
      <div>
        {
          participant.get('phone_numbers') && participant.get('phone_numbers').map((phoneNumber, index) => (
            <div key={index}>
              <div className='row gap-top' id={`phone-number-${phoneNumber.get('id')}`}>
                <ShowField gridClassName='col-md-6' label='Phone Number'>
                  {phoneNumber.get('number')}
                </ShowField>
                <ShowField gridClassName='col-md-6' label='Phone Number Type'>
                  {phoneNumber.get('type')}
                </ShowField>
              </div>
            </div>
          ))
        }
      </div>
      <div>
        {
          participant.get('addresses') && participant.get('addresses').map((address, index) => (
            <div key={index}>
              <div className='row gap-top' id={`address-${address.get('id')}`}>
                <ShowField gridClassName='col-md-6' label='Address'>
                  {address.get('street_address')}
                </ShowField>
                <ShowField gridClassName='col-md-6' label='City'>
                  {address.get('city')}
                </ShowField>
              </div>
              <div className='row'>
                <ShowField gridClassName='col-md-4' label='State'>
                  {US_STATE[address.get('state')]}
                </ShowField>
                <ShowField gridClassName='col-md-2' label='Zip'>
                  {address.get('zip')}
                </ShowField>
                <ShowField gridClassName='col-md-6' label='Address Type'>
                  {address.get('type')}
                </ShowField>
              </div>
            </div>
            ))
        }
      </div>
    </div>
  </div>
)

ParticipantShowView.propTypes = {
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func.isRequired,
  participant: React.PropTypes.object.isRequired,
}
export default ParticipantShowView
