import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const NarrativeEditView = ({errors, screening, onBlur, onCancel, onChange, onSave}) => (
  <div className='card-body'>
    <div className='row'>
      <FormField
        errors={errors.report_narrative}
        gridClassName='col-md-12'
        htmlFor='report_narrative'
        label='Report Narrative'
        required
      >
        <textarea
          id='report_narrative'
          onChange={(event) => onChange(['report_narrative'], event.target.value || null)}
          onBlur={(event) => onBlur(event)}
          required value={screening.get('report_narrative') || ''}
        />
      </FormField>
    </div>
    <div className='row'>
      <div className='centered'>
        <button className='btn btn-primary' onClick={onSave}>Save</button>
        <button className='btn btn-default' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
)

NarrativeEditView.propTypes = {
  errors: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default NarrativeEditView
