import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const NarrativeForm = ({
  reportNarrative,
  errors,
  toggleShow,
  screening,
  screeningWithEdits,
  actions: {
    setField,
    touchAllFields,
    touchField,
    resetFieldValues,
    saveScreening,
  },
}) => {
  const cancel = () => {
    resetFieldValues(screening)
    touchAllFields()
    toggleShow()
  }
  const save = () => {
    saveScreening(screeningWithEdits)
    touchAllFields()
    toggleShow()
  }
  return (
    <div className='card-body'>
      <div className='row'>
        <FormField
          errors={errors}
          gridClassName='col-md-12'
          htmlFor='report_narrative'
          label='Report Narrative'
          required
        >
          <textarea
            id='report_narrative'
            onChange={({target: {value}}) => setField('report_narrative', value)}
            onBlur={() => touchField('report_narrative')}
            required
            value={reportNarrative}
          />
        </FormField>
      </div>
      <div className='row'>
        <div className='centered'>
          <button className='btn btn-primary' onClick={save}>Save</button>
          <button className='btn btn-default' onClick={cancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

NarrativeForm.propTypes = {
  actions: PropTypes.object.isRequired,
  errors: PropTypes.array,
  reportNarrative: PropTypes.string,
  screening: PropTypes.object,
  screeningWithEdits: PropTypes.object,
  toggleShow: PropTypes.func,
}

export default NarrativeForm
