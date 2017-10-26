import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const NarrativeForm = ({
  errors,
  onBlur,
  onCancel,
  onChange,
  onSave,
  reportNarrative,
}) => (
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
          onChange={({target: {value}}) => onChange('report_narrative', value)}
          onBlur={() => onBlur('report_narrative')}
          required
          value={reportNarrative}
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

NarrativeForm.propTypes = {
  errors: PropTypes.object,
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  reportNarrative: PropTypes.string,
}

NarrativeForm.defaultProps = {
  errors: [],
}

export default NarrativeForm
