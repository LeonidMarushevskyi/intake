import * as IntakeConfig from 'config'
import EditLink from 'components/common/EditLink'
import GENDERS from 'Genders'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'components/common/ShowField'
import US_STATE from 'USState'
import nameFormatter from 'utils/nameFormatter'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import ssnFormatter from 'utils/ssnFormatter'
import {dateFormatter} from 'utils/dateFormatter'

const ParticipantShowView = ({participant, onDelete, onEdit}) => {
  const legacyDescriptor = participant.get('legacy_descriptor')
  const legacySourceString = legacyDescriptor ? legacySourceFormatter(legacyDescriptor.toJS()) : ''

  return (
  <div className='card show double-gap-top' id={`participants-card-${participant.get('id')}`}>
    <div className='card-header'>
      <span>{nameFormatter(participant)}</span>
      <button aria-label='Delete participant'
        className='pull-right delete-button'
        onClick={() => onDelete(participant.get('id'))}
      >
        <i className='fa fa-times' />
      </button>
      { IntakeConfig.isFeatureInactive('release_two') && <EditLink ariaLabel='Edit participant' onClick={onEdit} /> }
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-2'>
          <img src='/assets/default-profile.svg' />
        </div>
        <div className='col-md-10'>
          {legacySourceString !== '' && <div className='row'>
          <div className='col-md-12'>
            <span>{legacySourceString}</span>
          </div>
        </div>}
        <div className='row'>
          <div className='col-md-5'>
            <ShowField label='Name'>
              {nameFormatter(participant)}
            </ShowField>
            <ShowField label='Gender'>
              {GENDERS[participant.get('gender')]}
            </ShowField>
          </div>
          <div className='col-md-5'>
            <ShowField label='Role(s)'>{
              (participant.get('roles') || []).map((role, index) =>
                (<li key={`role-${index}`}>{`${role}`}</li>)
              )}</ShowField>
          </div>
          <div className='col-md-5'>
            <ShowField label='Language(s)'>
              {(participant.get('languages') || []).join(', ')}
            </ShowField>
          </div>
          <div className='col-md-5'>
            <ShowField label='Date of birth'>
              {dateFormatter(participant.get('date_of_birth'))}
            </ShowField>
            <ShowField label='Social security number'>
              {ssnFormatter(participant.get('ssn'))}
            </ShowField>
          </div>
        </div>
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
          participant.get('addresses') && participant.get('addresses').map((address, index) => {
            const state = US_STATE.find((state) => state.code === address.get('state'))
            return (
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
                  {state ? state.name : ''}
                </ShowField>
                <ShowField gridClassName='col-md-2' label='Zip'>
                  {address.get('zip')}
                </ShowField>
                <ShowField gridClassName='col-md-6' label='Address Type'>
                  {address.get('type')}
                </ShowField>
              </div>
            </div>
            )
          })
        }
      </div>
    </div>
  </div>
  )
}

ParticipantShowView.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func.isRequired,
  participant: PropTypes.object.isRequired,
}
export default ParticipantShowView
