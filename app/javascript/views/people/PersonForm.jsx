import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import InputField from 'common/InputField'
import SelectField from 'common/SelectField'
import MaskedInputField from 'common/MaskedInputField'

const PersonForm = ({
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
}) => (
  <div className='card-body'>
    {
      Boolean(legacySourceDescription) &&
        <div className='row'>
          <div className='col-md-12'>
            <div className='c-dark-grey double-gap-top'>{legacySourceDescription}</div>
          </div>
        </div>
    }
    <div className='row'>
      <div className='col-md-12'>
        <label htmlFor={`roles_${personId}`}>Role</label>
        <Select
          multi
          tabSelectsValue={false}
          inputProps={{id: `roles_${personId}`}}
          value={roles}
          clearable={false}
          options={roleOptions}
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
        value={firstName}
      />
      <InputField
        gridClassName='col-md-4'
        id='middle_name'
        label='Middle Name'
        maxLength='64'
        value={middleName}
      />
      <InputField
        gridClassName='col-md-4'
        id='last_name'
        label='Last Name'
        maxLength='64'
        value={lastName}
      />
    </div>
    <div className='row'>
      <SelectField
        gridClassName='col-md-4'
        id='name_suffix'
        label='Suffix'
        value={nameSuffix}
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
        value={ssn}
      />
    </div>
  </div>
)
PersonForm.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  legacySourceDescription: PropTypes.string,
  middleName: PropTypes.string,
  nameSuffix: PropTypes.string,
  nameSuffixOptions: PropTypes.array,
  personId: PropTypes.string.isRequired,
  roleOptions: PropTypes.array,
  roles: PropTypes.array,
  ssn: PropTypes.string,
}
export default PersonForm
