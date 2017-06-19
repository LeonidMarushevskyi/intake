import React from 'react'
import PropTypes from 'prop-types'
import COMMUNICATION_METHOD from 'CommunicationMethod'
import DateField from 'components/common/DateField'
import InputField from 'components/common/InputField'
import SelectField from 'components/common/SelectField'

const ScreeningInformationEditView = ({screening, onCancel, onChange, onSave, onBlur}) => (
  <div className='card edit double-gap-top' id='screening-information-card'>
    <div className='card-header'>
      <span>Screening Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <InputField
          gridClassName='col-md-6'
          id='name'
          label='Title/Name of Screening'
          placeholder='Enter name of the screening'
          value={screening.get('name') || ''}
          onChange={(event) => onChange(['name'], event.target.value)}
        />
        <InputField
          gridClassName='col-md-6'
          id='assignee'
          label='Assigned Social Worker'
          required
          placeholder='Enter the name of the worker screening report'
          value={screening.get('assignee') || ''}
          onChange={(event) => onChange(['assignee'], event.target.value)}
          onBlur={(event) => onBlur('assignee', event.target.value)}
        />
      </div>
      <div className='row'>
        <DateField
          gridClassName='col-md-6'
          id='started_at'
          label='Screening Start Date/Time'
          required
          value={screening.get('started_at')}
          onChange={(value) => onChange(['started_at'], value)}
        />
        <DateField
          gridClassName='col-md-6'
          id='ended_at'
          label='Screening End Date/Time'
          value={screening.get('ended_at')}
          onChange={(value) => onChange(['ended_at'], value)}
        />
        </div>
        <div className='row'>
          <SelectField
            gridClassName='col-md-6'
            id='communication_method'
            label='Communication Method'
            required
            value={screening.get('communication_method')}
            onChange={(event) => onChange(['communication_method'], event.target.value || null)}
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
  </div>
)

ScreeningInformationEditView.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default ScreeningInformationEditView
