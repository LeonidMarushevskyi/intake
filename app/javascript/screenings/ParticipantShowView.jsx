import GENDERS from 'enums/Genders'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'
import US_STATE from 'enums/USState'
import nameFormatter from 'utils/nameFormatter'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import ssnFormatter from 'utils/ssnFormatter'
import {dateFormatter} from 'utils/dateFormatter'
import AvatarImg from '../../assets/images/default-profile.svg'
import {flagPrimaryLanguage} from 'common/LanguageInfo'

const ParticipantShowView = ({participant}) => {
  const legacyDescriptor = participant.get('legacy_descriptor')
  const legacySourceString = legacyDescriptor ? legacySourceFormatter(legacyDescriptor.toJS()) : ''

  const phoneNumberFormatter = (phoneNumber) => {
    // Data is Sanitized onSave but this show view gets rendered before api request come back.
    // As a result, we're stuck with data with presentation.
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    // eslint-disable-next-line no-magic-numbers
    return `(${phoneNumber.substr(0, 3)})${phoneNumber.substr(3, 3)}-${phoneNumber.substr(6, 4)}`
  }
  const {ethnicity} = participant.toJS()
  const {hispanic_latino_origin, ethnicity_detail} = ethnicity || {}
  const showDateOfBirth = participant.get('date_of_birth') || !(participant.get('approximate_age'))
  const showApproximateAge = !showDateOfBirth

  return (
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-2'>
          <img src={AvatarImg} />
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
                {nameFormatter(participant.toJS())}
              </ShowField>
              <ShowField label='Gender'>
                {GENDERS[participant.get('gender')]}
              </ShowField>
            </div>
            <div className='col-md-5'>
              <ShowField label='Role(s)'>
                {participant.get('roles') &&
                  <ul>
                    {participant.get('roles').map((role, index) =>
                      (<li key={`role-${index}`}>{`${role}`}</li>)
                    )}
                  </ul>
                }
              </ShowField>
            </div>
            <div className='col-md-5'>
              <ShowField label='Language(s) (Primary First)'>
                {flagPrimaryLanguage((participant.toJS().languages) || []).join(', ')}
              </ShowField>
            </div>
            <div className='col-md-5'>
              {showDateOfBirth &&
              <ShowField label='Date of birth'>
                {dateFormatter(participant.get('date_of_birth'))}
              </ShowField>
              }
              {showApproximateAge &&
              <ShowField label='Approximate Age'>
                {[participant.get('approximate_age'), participant.get('approximate_age_units')].join(' ')}
              </ShowField>
              }
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
              <div className='row gap-top'>
                <ShowField gridClassName='col-md-6' label='Phone Number'>
                  {phoneNumberFormatter(phoneNumber.get('number'))}
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
      <div className='row gap-top'>
        <ShowField gridClassName='col-md-12' label='Race'>
          {
            participant.get('races') && participant.get('races').map((raceInformation) => {
              const race = raceInformation.get('race')
              const raceDetail = raceInformation.get('race_detail')
              const raceDetailText = (raceDetail && ` - ${raceDetail}`) || ''
              return `${race}${raceDetailText}`
            }).join(', ')
          }
        </ShowField>
      </div>
      <div className='row gap-top'>
        <ShowField gridClassName='col-md-12' label='Hispanic/Latino Origin'>
          {hispanic_latino_origin &&
            `${hispanic_latino_origin}${(ethnicity_detail && ` - ${ethnicity_detail}`) || ''}`
          }
        </ShowField>
      </div>
    </div>
  )
}

ParticipantShowView.propTypes = {
  participant: PropTypes.object.isRequired,
}
export default ParticipantShowView
