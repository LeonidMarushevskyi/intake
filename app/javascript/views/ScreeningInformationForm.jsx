import DateField from 'common/DateField'
import InputField from 'common/InputField'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'

const ScreeningInformationForm = ({
  assignee,
  assigneeDisabled,
  communicationMethod,
  communicationMethods,
  endedAt,
  errors,
  name,
  startedAt,
  onSave,
  onCancel,
  onBlur,
  onChange,
}) => (
  <div className='card-body'>
    <div className='row'>
      <InputField
        allowCharacters={/[a-zA-Z\s'’-]/}
        gridClassName='col-md-4'
        id='name'
        label='Title/Name of Screening'
        maxLength='64'
        placeholder='Enter name of the screening'
        value={name || ''}
        onBlur={() => onBlur('name')}
        onChange={({target: {value}}) => onChange('name', value)}
      />
      <InputField
        allowCharacters={/[a-zA-Z\s]/}
        disabled={assigneeDisabled}
        errors={errors.assignee}
        gridClassName='col-md-4'
        id='assignee'
        label='Assigned Social Worker'
        maxLength='64'
        placeholder='Enter the name of the worker screening report'
        required
        value={assignee || ''}
        onBlur={() => onBlur('assignee')}
        onChange={({target: {value}}) => onChange('assignee', value)}
      />
    </div>
    <div className='row'>
      <DateField
        gridClassName='col-md-4'
        id='started_at'
        label='Screening Start Date/Time'
        required
        value={startedAt}
        errors={errors.started_at}
        onBlur={() => onBlur('started_at')}
        onChange={(value) => onChange('started_at', value)}
      />
      <DateField
        gridClassName='col-md-4'
        id='ended_at'
        label='Screening End Date/Time'
        value={endedAt}
        errors={errors.ended_at}
        onBlur={() => onBlur('ended_at')}
        onChange={(value) => onChange('ended_at', value)}
      />
      <SelectField
        gridClassName='col-md-4'
        id='communication_method'
        label='Communication Method'
        required
        value={communicationMethod}
        errors={errors.communication_method}
        onBlur={() => onBlur('communication_method')}
        onChange={({target: {value}}) => onChange('communication_method', value)}
      >
        <option key='' />
        {communicationMethods.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
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
ScreeningInformationForm.propTypes = {
  assignee: PropTypes.string,
  assigneeDisabled: PropTypes.bool,
  communicationMethod: PropTypes.string,
  communicationMethods: PropTypes.array,
  endedAt: PropTypes.string,
  errors: PropTypes.object,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  startedAt: PropTypes.string,
}
export default ScreeningInformationForm
