import React from 'react'
import PropTypes from 'prop-types'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import DateField from 'common/DateField'
import InputField from 'common/InputField'
import SelectField from 'common/SelectField'

const ScreeningInformationEditView = ({screening, onCancel, onChange, onSave, validateField, validateOnChange, errors}) => (
  <div className='card-body'>
    <div className='row'>
      <InputField
        allowCharacters={/[a-zA-Z\s'’-]/}
        gridClassName='col-md-6'
        id='name'
        label='Title/Name of Screening'
        maxLength='64'
        onChange={(event) => onChange(['name'], event.target.value)}
        placeholder='Enter name of the screening'
        value={screening.get('name') || ''}
      />
      <InputField
        allowCharacters={/[a-zA-Z\s]/}
        disabled={Boolean(screening.get('assignee_staff_id'))}
        errors={errors.assignee}
        gridClassName='col-md-6'
        id='assignee'
        label='Assigned Social Worker'
        maxLength='64'
        onBlur={(event) => validateField('assignee', event.target.value)}
        onChange={(event) => validateOnChange('assignee', event.target.value)}
        placeholder='Enter the name of the worker screening report'
        required
        value={screening.get('assignee') || ''}
      />
    </div>
    <div className='row'>
      <DateField
        gridClassName='col-md-6'
        id='started_at'
        label='Screening Start Date/Time'
        required
        value={screening.get('started_at')}
        onChange={(value) => validateOnChange('started_at', value)}
        onBlur={(value) => validateField('started_at', value)}
        errors={errors.started_at}
      />
      <DateField
        gridClassName='col-md-6'
        id='ended_at'
        label='Screening End Date/Time'
        value={screening.get('ended_at')}
        onChange={(value) => validateOnChange('ended_at', value)}
        onBlur={(value) => validateField('ended_at', value)}
        errors={errors.ended_at}
      />
    </div>
    <div className='row'>
      <SelectField
        gridClassName='col-md-6'
        id='communication_method'
        label='Communication Method'
        required
        value={screening.get('communication_method')}
        onChange={(event) => validateOnChange('communication_method', event.target.value || null)}
        onBlur={(event) => validateField('communication_method', event.target.value)}
        errors={errors.communication_method}
      >
        <option key='' />
        {Object.keys(COMMUNICATION_METHOD).map((item) => <option key={item} value={item}>{COMMUNICATION_METHOD[item]}</option>)}
      </SelectField>
    </div>
    <div className='row'>
      <div className='centered'>
        <button className='btn btn-primary' onClick={onSave}>Save</button>
        <button className='btn btn-default' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
)

ScreeningInformationEditView.propTypes = {
  errors: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
  validateField: PropTypes.func.isRequired,
  validateOnChange: PropTypes.func.isRequired,
}
export default ScreeningInformationEditView
