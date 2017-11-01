import AddressesEditView from 'people/AddressesEditView'
import APPROXIMATE_AGE_UNITS from 'enums/ApproximateAgeUnits'
import DateField from 'common/DateField'
import EthnicityEditView from 'people/EthnicityEditView'
import Genders from 'enums/Genders'
import NAME_SUFFIXES from 'enums/NameSuffixes'
import Immutable from 'immutable'
import InputField from 'common/InputField'
import MaskedInputField from 'common/MaskedInputField'
import LANGUAGES from 'enums/Languages'
import PhoneNumbersEditView from 'people/PhoneNumbersEditView'
import PropTypes from 'prop-types'
import RacesEditView from 'people/RacesEditView'
import React from 'react'
import Select from 'react-select'
import SelectField from 'common/SelectField'
import selectOptions from 'utils/selectHelper'
import legacySourceFormatter from 'utils/legacySourceFormatter'
import {MAX_LANGUAGES} from 'common/LanguageInfo'
import {ROLE_TYPE_REPORTER, ROLE_TYPE} from 'enums/RoleType'

const ParticipantEditView = ({participant, onCancel, onChange, onDobBlur, onSave}) => {
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
  const haveDob = Boolean(participant.get('date_of_birth'))

  return (
    <div className='card-body'>
      {legacySourceString !== '' && <div className='row'>
        <div className='col-md-12'>
          <div className='c-dark-grey double-gap-top'>{legacySourceString}</div>
        </div>
      </div>}
      <div className='row'>
        <div className='col-md-12'>
          <label htmlFor={`roles_${participant.get('id')}`}>Role</label>
          <Select
            multi
            tabSelectsValue={false}
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
      <div className='row'>
        <InputField
          gridClassName='col-md-4'
          id='first_name'
          label='First Name'
          maxLength='64'
          onChange={(event) => onChange(['first_name'], event.target.value || null)}
          value={participant.get('first_name') || ''}
        />
        <InputField
          gridClassName='col-md-4'
          id='middle_name'
          label='Middle Name'
          maxLength='64'
          onChange={(event) => onChange(['middle_name'], event.target.value || null)}
          value={participant.get('middle_name') || ''}
        />
        <InputField
          gridClassName='col-md-4'
          id='last_name'
          label='Last Name'
          maxLength='64'
          onChange={(event) => onChange(['last_name'], event.target.value || null)}
          value={participant.get('last_name') || ''}
        />
      </div>
      <div className='row'>
        <SelectField
          gridClassName='col-md-4'
          id='name_suffix'
          label='Suffix'
          value={participant.get('name_suffix')}
          onChange={(event) => onChange(['name_suffix'], event.target.value || null)}
        >
          <option key='' value='' />
          {Object.keys(NAME_SUFFIXES).map((item) => <option key={item} value={item}>{NAME_SUFFIXES[item]}</option>)}
        </SelectField>
        <MaskedInputField
          gridClassName='col-md-4'
          id={`participant-${participant.get('id')}-ssn`}
          label='Social security number'
          mask='111-11-1111'
          placeholder='___-__-____'
          value={participant.get('ssn') || ''}
          onChange={(event) => onChange(['ssn'], event.target.value || null)}
        />
      </div>
      <div className='row'>
        <div className='col-md-12 double-gap-top'>
          <legend>Demographic Information</legend>
        </div>
      </div>
      <div className='row'>
        <DateField
          gridClassName='col-md-3'
          id='date_of_birth'
          label='Date of birth'
          hasTime={false}
          hasCalendar={false}
          value={participant.get('date_of_birth')}
          onChange={(value) => onChange(['date_of_birth'], value)}
          onBlur={(value) => onDobBlur(value)}
        />
        <div className='col-md-1 text-between-inputs' >or</div>
        <InputField
          gridClassName='col-md-2'
          id='approximate_age'
          label='Approximate Age'
          allowCharacters={/[0-9]/}
          maxLength='3'
          value={participant.get('approximate_age') || ''}
          onChange={(event) => onChange(['approximate_age'], event.target.value || null)}
          disabled={haveDob}
        />
        <div className='col-md-2 input-no-header'>
          <select
            id='approximate_age_units'
            aria-label='Approximate Age Units'
            value={participant.get('approximate_age_units') || 'years'}
            onChange={(event) => onChange(['approximate_age_units'], event.target.value || null)}
            disabled={haveDob}
          >
            {Object.keys(APPROXIMATE_AGE_UNITS).map((item) => <option key={item} value={item}>{APPROXIMATE_AGE_UNITS[item]}</option>)}
          </select>
        </div>
        <SelectField
          gridClassName='col-md-4'
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
        <div className='col-md-12'>
          <label htmlFor='languages'>Language(s) (Primary First)</label>
          <Select
            multi
            tabSelectsValue={false}
            inputProps={{id: 'languages'}}
            options={selectOptions(LANGUAGES)}
            value={(participant.get('languages') || Immutable.List()).toJS()}
            onChange={(languages) =>
              onChange(
                ['languages'],
                Immutable.List(languages.slice(0, MAX_LANGUAGES).map((languages) => languages.value)) || []
              )
            }
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12 gap-top'>
          <RacesEditView
            id={`participant-${participant.get('id')}`}
            races={participant.get('races') || Immutable.List()}
            onChange={(races) => onChange(['races'], races)}
          />
        </div>
        <div className='col-md-12 gap-top'>
          <EthnicityEditView
            id={`participant-${participant.get('id')}`}
            ethnicity={participant.get('ethnicity') || Immutable.Map()}
            onChange={(ethnicity) => onChange(['ethnicity'], ethnicity)}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12 double-gap-top'>
          <legend>Contact & Location Information</legend>
        </div>
      </div>
      <PhoneNumbersEditView
        phoneNumbers={participant.get('phone_numbers') || Immutable.List()}
        onChange={(phone_numbers) => onChange(['phone_numbers'], phone_numbers || [])}
      />
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
  )
}

ParticipantEditView.propTypes = {
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onDobBlur: PropTypes.func,
  onSave: PropTypes.func,
  participant: PropTypes.object.isRequired,
}
export default ParticipantEditView
