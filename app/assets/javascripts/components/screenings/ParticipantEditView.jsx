import AddressesEditView from 'components/people/AddressesEditView'
import DateField from 'components/common/DateField'
import Genders from 'Genders'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import LANGUAGES from 'Languages'
import MaskedInputField from 'components/common/MaskedInputField'
import NAME_SUFFIXES from 'NameSuffixes'
import PhoneNumbersEditView from 'components/people/PhoneNumbersEditView'
import PropTypes from 'prop-types'
import React from 'react'
import Select from 'react-select'
import SelectField from 'components/common/SelectField'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import nameFormatter from 'utils/nameFormatter'
import selectOptions from 'utils/selectHelper'
import {ROLE_TYPE_REPORTER, ROLE_TYPE} from 'RoleType'

const ParticipantEditView = ({participant, onCancel, onChange, onDelete, onSave}) => {
  const roleOptions = (selectedRoles = Immutable.List()) => {
    const hasReporterRole = selectedRoles.some((role) =>
      ROLE_TYPE_REPORTER.includes(role)
    )
    // Need to identify the reporter role already selected for this participant so
    // we can leave its select element active and not disable it as disabeled items
    // are removed from the list of selected items as part of the onChange action.
    const selectedReporterRole = selectedRoles.find((role) => ROLE_TYPE_REPORTER.includes(role))

    return ROLE_TYPE.map((role) => {
      const reporter = ROLE_TYPE_REPORTER.includes(role)
      let item = {label: role, value: role}
      if (reporter && role !== selectedReporterRole) {
        item = {...item, disabled: hasReporterRole}
      }
      return item
    })
  }

  const legacyDescriptor = participant.get('legacy_descriptor')
  const legacySourceString = legacyDescriptor ? legacySourceFormatter(legacyDescriptor.toJS()) : ''

  return (
    <div className='card edit double-gap-top' id={`participants-card-${participant.get('id')}`}>
      <div className='card-header'>
        <span>{nameFormatter(participant)}</span>
        <button aria-label='Delete participant'
          className='pull-right delete-button'
          onClick={() => onDelete(participant.get('id'))}
        >
          <i className='fa fa-times' />
        </button>
      </div>
      <div className='card-body'>
        {legacySourceString !== '' && <div className='row'>
          <div className='col-md-12'>
            <span>{legacySourceString}</span>
          </div>
        </div>}
        <div className='row'>
          <InputField
            gridClassName='col-md-3'
            id='first_name'
            label='First Name'
            maxLength='64'
            onChange={(event) => onChange(['first_name'], event.target.value || null)}
            value={participant.get('first_name') || ''}
          />
          <InputField
            gridClassName='col-md-3'
            id='middle_name'
            label='Middle Name'
            maxLength='64'
            onChange={(event) => onChange(['middle_name'], event.target.value || null)}
            value={participant.get('middle_name') || ''}
          />
          <InputField
            gridClassName='col-md-3'
            id='last_name'
            label='Last Name'
            maxLength='64'
            onChange={(event) => onChange(['last_name'], event.target.value || null)}
            value={participant.get('last_name') || ''}
          />
          <SelectField
            gridClassName='col-md-3'
            id='name_suffix'
            label='Suffix'
            value={participant.get('name_suffix')}
            onChange={(event) => onChange(['name_suffix'], event.target.value || null)}
          >
            <option key='' value='' />
            {Object.keys(NAME_SUFFIXES).map((item) => <option key={item} value={item}>{NAME_SUFFIXES[item]}</option>)}
          </SelectField>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor={`roles_${participant.get('id')}`}>Role</label>
            <Select
              multi
              inputProps={{id: `roles_${participant.get('id')}`}}
              value={participant.get('roles').toJS()}
              onChange={(roles) => {
                onChange(['roles'], Immutable.List(
                  roles.filter((role) => !role.disabled).map((role) => role.value)) || [])
              }}
              options={roleOptions(participant.get('roles'))}
              clearable={false}
              placeholder=''
            />
          </div>
        </div>
        <PhoneNumbersEditView
          phoneNumbers={participant.get('phone_numbers') || Immutable.List()}
          onChange={(phone_numbers) => onChange(['phone_numbers'], phone_numbers || [])}
        />
        <div className='row'>
          <DateField
            gridClassName='col-md-6'
            id='date_of_birth'
            label='Date of birth'
            hasTime={false}
            hasCalendar={false}
            value={participant.get('date_of_birth')}
            onChange={(value) => onChange(['date_of_birth'], value)}
          />
          <SelectField
            gridClassName='col-md-6'
            id='gender'
            label='Gender'
            value={participant.get('gender')}
            onChange={(event) => onChange(['gender'], event.target.value || null)}
          >
            <option key='' value='' />
            {Object.keys(Genders).map((item) => <option key={item} value={item}>{Genders[item]}</option>)}
          </SelectField>
        </div>
        <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='languages'>Language(s)</label>
              <Select
                multi
                inputProps={{id: 'languages'}}
                options={selectOptions(LANGUAGES)}
                value={(participant.get('languages') || Immutable.List()).toJS()}
                onChange={(languages) =>
                  onChange(
                    ['languages'],
                    Immutable.List(languages.map((languages) => languages.value)) || []
                  )
                }
              />
            </div>
          </div>
        <div className='row'>
          <MaskedInputField
            gridClassName='col-md-6'
            id={`participant-${participant.get('id')}-ssn`}
            label='Social security number'
            mask='111-11-1111'
            placeholder=''
            blurPlaceholder=''
            focusPlaceholder='___-__-____'
            value={participant.get('ssn') || ''}
            onChange={(event) => onChange(['ssn'], event.target.value || null)}
          />
        </div>
        <AddressesEditView
          addresses={participant.get('addresses') || Immutable.List()}
          onChange={(addresses) => onChange(['addresses'], addresses || [])}
        />
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={onSave}>Save</button>
            <button className='btn btn-default' onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

ParticipantEditView.propTypes = {
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  participant: PropTypes.object.isRequired,
}
export default ParticipantEditView
