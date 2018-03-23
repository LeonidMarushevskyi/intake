import DateField from 'common/DateField'
import InlineHeader from 'common/InlineHeader'
import InputField from 'common/InputField'
import PropTypes from 'prop-types'
import React from 'react'
import Select from 'react-select'
import SelectField from 'common/SelectField'

const PersonDemographicsForm = ({
  approximateAge,
  approximateAgeIsDisabled,
  approximateAgeUnit,
  approximateAgeUnitOptions,
  dateOfBirth,
  gender,
  genderOptions,
  languageOptions,
  languages,
  onChange,
  personId,
}) => (
  <div>
    <div className='row'>
      <InlineHeader heading='Demographic Information' />
    </div>
    <div className='row'>
      <DateField
        gridClassName='col-md-3'
        id='date_of_birth'
        label='Date of birth'
        hasTime={false}
        hasCalendar={false}
        value={dateOfBirth}
        onChange={(value) => onChange('date_of_birth', value)}
      />
      <div className='col-md-1'>or</div>
      <InputField
        gridClassName='col-md-2'
        id='approximate_age'
        label='Approximate Age'
        allowCharacters={/[0-9]/}
        maxLength='3'
        value={approximateAge}
        onChange={({target: {value}}) => onChange('approximate_age', value)}
        disabled={approximateAgeIsDisabled}
      />
      <div className='col-md-2'>
        <select
          id='approximate_age_units'
          aria-label='Approximate Age Units'
          value={approximateAgeUnit}
          onChange={({target: {value}}) => onChange('approximate_age_units', value)}
          disabled={approximateAgeIsDisabled}
        >
          {approximateAgeUnitOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <SelectField
        gridClassName='col-md-4'
        id='gender'
        label='Gender'
        value={gender}
        onChange={({target: {value}}) => onChange('gender', value)}
      >
        <option key='' value='' />
        {genderOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
      </SelectField>
    </div>
    <div className='row'>
      <div className='col-md-12'>
        <label htmlFor={`languages_${personId}`}>Language(s) (Primary First)</label>
        <Select
          multi
          tabSelectsValue={false}
          inputProps={{id: `languages_${personId}`}}
          options={languageOptions}
          value={languages}
          onChange={(languages) => onChange('languages', languages)}
        />
      </div>
    </div>
  </div>
)
PersonDemographicsForm.propTypes = {
  approximateAge: PropTypes.string,
  approximateAgeIsDisabled: PropTypes.bool,
  approximateAgeUnit: PropTypes.string,
  approximateAgeUnitOptions: PropTypes.array,
  dateOfBirth: PropTypes.string,
  gender: PropTypes.string,
  genderOptions: PropTypes.array,
  languageOptions: PropTypes.array,
  languages: PropTypes.array,
  onChange: PropTypes.func,
  personId: PropTypes.string,
}
export default PersonDemographicsForm
