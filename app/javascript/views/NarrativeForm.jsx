import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const NarrativeForm = ({
  onBlur,
  onCancel,
  onChange,
  onSave,
  reportNarrative,
}) => (
  <div className='card-body'>
    <div className='row'>
      <FormField
        errors={reportNarrative.errors}
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
          value={reportNarrative.value}
        />
      </FormField>
    </div>
    <div className='row'>
      <div className='col-md-12'>
        <div className='pull-right'>
          <button className='btn btn-default' onClick={onCancel}>Cancel</button>
          <button className='btn btn-primary' onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  </div>
)

NarrativeForm.propTypes = {
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  reportNarrative: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.array,
  }),
}

NarrativeForm.defaultProps = {
  reportNarrative: {},
}

export default NarrativeForm
