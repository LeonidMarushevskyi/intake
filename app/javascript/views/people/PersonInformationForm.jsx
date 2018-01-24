import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import InputField from 'common/InputField'
import SelectField from 'common/SelectField'
import MaskedInputField from 'common/MaskedInputField'
import AlertErrorMessage from 'common/AlertErrorMessage'
import ErrorMessages from 'common/ErrorMessages'

const PersonInformationForm = ({
  firstName,
  lastName,
  legacySourceDescription,
  middleName,
  nameSuffix,
  nameSuffixOptions,
  personId,
  roleOptions,
  roles,
  ssn,
  onChange,
  onBlur,
  alertErrorMessage,
}) => (
  <div>
    {
      Boolean(legacySourceDescription) &&
        <div className='row'>
          <div className='col-md-12'>
            <div className='c-dark-grey double-gap-bottom'>{legacySourceDescription}</div>
          </div>
        </div>
    }
    { alertErrorMessage && <AlertErrorMessage message={alertErrorMessage} /> }
    <div className='row'>
      <div className='col-md-12'>
        <label htmlFor={`roles_${personId}`}>Role</label>
        <Select
          multi
          tabSelectsValue={false}
          inputProps={{id: `roles_${personId}`}}
          value={roles.value}
          clearable={false}
          options={roleOptions}
          placeholder=''
          onChange={(values) => onChange('roles', values.map(({value}) => value))}
          onBlur={() => onBlur('roles')}
        />
        {roles && <ErrorMessages ariaDescribedBy={`roles_${personId}`} errors={roles.errors}/>}
      </div>
    </div>
    <div className='row'>
      <InputField
        errors={firstName.errors}
        gridClassName='col-md-4'
        id='first_name'
        label='First Name'
        maxLength='64'
        value={firstName.value || ''}
        onChange={({target: {value}}) => onChange('first_name', value)}
        onBlur={() => onBlur('first_name')}
        required={firstName.required}
      />
      <InputField
        gridClassName='col-md-4'
        id='middle_name'
        label='Middle Name'
        maxLength='64'
        value={middleName || ''}
        onChange={({target: {value}}) => onChange('middle_name', value)}
      />
      <InputField
        errors={lastName.errors}
        gridClassName='col-md-4'
        id='last_name'
        label='Last Name'
        maxLength='64'
        value={lastName.value || ''}
        onChange={({target: {value}}) => onChange('last_name', value)}
        onBlur={() => onBlur('last_name')}
        required={lastName.required}
      />
    </div>
    <div className='row'>
      <SelectField
        gridClassName='col-md-4'
        id='name_suffix'
        label='Suffix'
        value={nameSuffix}
        onChange={({target: {value}}) => onChange('name_suffix', value)}
      >
        <option key='' value='' />
        {nameSuffixOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
      </SelectField>
      <MaskedInputField
        gridClassName='col-md-4'
        id='ssn'
        label='Social security number'
        mask='111-11-1111'
        placeholder='___-__-____'
        value={ssn.value || ''}
        onBlur={() => onBlur('ssn')}
        onChange={({target: {value}}) => onChange('ssn', value)}
        errors={ssn.errors}
      />
    </div>
  </div>
)
PersonInformationForm.propTypes = {
  alertErrorMessage: PropTypes.string,
  firstName: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
    required: PropTypes.bool,
  }),
  lastName: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
    required: PropTypes.bool,
  }),
  legacySourceDescription: PropTypes.string,
  middleName: PropTypes.string,
  nameSuffix: PropTypes.string,
  nameSuffixOptions: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  personId: PropTypes.string.isRequired,
  roleOptions: PropTypes.array,
  roles: PropTypes.object,
  ssn: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
  }),
}
export default PersonInformationForm
